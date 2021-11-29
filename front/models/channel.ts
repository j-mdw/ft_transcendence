export enum ChannelType {
	public,
	private,
	password,
  }
  
  export interface ChannelDTO {
	id?: string;
	name: string;
	type: ChannelType;
	password?: string;
  }