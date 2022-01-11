export interface MessageReceived {
  channelId: string,
  userId: string,
  pseudo: string,
  message: string,
  gameInvite?: boolean;
}

export interface MessageToServerDTO {
  channelId: string;
  message: string;
  gameInvite?: boolean;
}
