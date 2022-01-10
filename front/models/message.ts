export interface MessageReceived {
  channelId: string,
  userId: string,
  pseudo: string,
  message: string,
}

export interface MessageToServerDTO {
  channelId: string;
  message: string;
  gameInvite?: boolean;
}
