export interface LoginValidation {
  email: string;
  password: string;
}

export interface SignUpValidation {
  email: string;
  password: string;
}

export interface AuthSignature {
  _id: string;
  email: string;
}

export interface updateUser {
  firstName : string,
  lastName : string,
  color : number
}

export interface SearchUserInputs {
  user : string
}

export interface ChannelInput {
  name : string,
  members : [string]
}