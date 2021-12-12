export enum UserStatus {
    online,
    offline,
    playing,
}

export class User {
  id: string = ''
  pseudo: string = ''
  avatarPath: string = ''
  status: UserStatus = UserStatus.offline
}

export class StatusUpdate {
  id: string = ''
  status: UserStatus = UserStatus.offline
}