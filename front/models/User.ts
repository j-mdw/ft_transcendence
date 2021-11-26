export enum UserStatus {
    online,
    offline,
    playing,
}

export interface User {
    id: string;
    pseudo: string;
    avatarPath: string;
    status: UserStatus;
}