import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { MatchHistory } from './matchHistory.entity';

@Injectable()
export class MatchHistoryService {
  constructor(
    @InjectRepository(MatchHistory)
    private matchRepository: Repository<MatchHistory>,
  ) {}
  async findUserMatches(user: User) {
    const u1Matches = await this.matchRepository.find({
      where: {
        user1: user,
      },
    });
    const u2Matches = (
      await this.matchRepository.find({
        where: {
          user2: user,
        },
      })
    ).map((match) => {
      const tmpUsr = match.user1;
      match.user1 = match.user2;
      match.user2 = tmpUsr;
      const tmpScore = match.user1Score;
      match.user1Score = match.user2Score;
      match.user2Score = tmpScore;
      return match;
    });
    return u1Matches.concat(u2Matches);
  }

  async add(user1: User, user2: User, score1: number, score2: number) {
    await this.matchRepository.save({
      user1Score: score1,
      user2Score: score2,
      createdAt: new Date(),
      user1: user1,
      user2: user2,
    });
  }
}
