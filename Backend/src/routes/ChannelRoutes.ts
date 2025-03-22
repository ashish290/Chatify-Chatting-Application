import {Router} from "express";
import { Authenticate } from "../middleware/CommonAuth";
import { CreateChannel, getChannelMessages, getUserChannels } from "../controllers/ChannelController";

const router = Router();

router.post('/channel',Authenticate,CreateChannel);
router.get('/user-channels',Authenticate,getUserChannels);
router.get('/get-channel-messages/:channelId',Authenticate,getChannelMessages);

export {router as ChannelRoutes};