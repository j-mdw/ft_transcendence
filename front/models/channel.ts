export enum ChannelType {
  public,
  private,
  protected,
}

export interface ChannelDTO {
  id?: string;
  name: string;
  type: ChannelType;
  password?: string;
}
