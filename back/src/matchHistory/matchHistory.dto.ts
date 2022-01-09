import { MatchHistory } from './matchHistory.entity';

export class MatchHistoryDTO {
  user1Id: string;
  user2Id: string;
  user1Score: number;
  user2Score: number;
  date: Date;

  constructor(match: MatchHistory) {
    this.user1Id = match.user1.id;
    this.user2Id = match.user2.id;
    this.user1Score = match.user1Score;
    this.user2Score = match.user2Score;
    this.date = match.createdAt;
  }
}
