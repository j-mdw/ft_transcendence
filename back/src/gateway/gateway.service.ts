import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class GatewayService {
  server: Server = null;

  createDMname(userId: string, peerId: string) {
    const cmp = userId.localeCompare(peerId);
    if (cmp > 0) {
      return `${userId}:${peerId}`;
    } else if (cmp < 0) {
      return `${peerId}:${userId}`;
    } else {
      return '';
    }
  }
}
