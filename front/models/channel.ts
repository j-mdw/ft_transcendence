export enum ChannelType {
  public,
  private,
  protected,
}

export interface CreateChannelDTO {
  name: string;
  type: ChannelType;
  password: string;
}

export interface ChannelDTO {
  id: string;
  name: string;
  type: ChannelType;
  owner: string;
}

export interface PasswordDTO {
  password: string;
}
