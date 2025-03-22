import mongoose, { Schema, Document } from "mongoose";

interface Channel extends Document {
  name: string;
  members: mongoose.Schema.Types.ObjectId[];
  admin: mongoose.Schema.Types.ObjectId;
  messages: mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ChannelSchema = new Schema({
  name: { type: String, required: true },
  members: [{ type: mongoose.Schema.ObjectId, ref: "User", required: true }],
  admin: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  messages: [
    { type: mongoose.Schema.ObjectId, ref: "Message", required: false },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  }, 
});

ChannelSchema.pre<Channel>("save", function(next) { 
    const channel = this;
    try {
      channel.updatedAt = new Date();
      next();
    } catch (error) {
      next();
    }
  });

ChannelSchema.pre("findOneAndUpdate", function(next) {
    this.set({updatedAt : Date.now()});
    next();
});

const Channel = mongoose.model<Channel>("Channel", ChannelSchema);
export default Channel;