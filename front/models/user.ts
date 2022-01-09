export enum UserStatus {
    online,
    offline,
    playing,
}

export class User {
  id: string = ''
  pseudo: string = ''
  victories = 0;
  defeats = 0;
  avatarPath: string = ''
  status: UserStatus = UserStatus.offline
}

export class StatusUpdate {
  id: string = ''
  status: UserStatus = UserStatus.offline
}
