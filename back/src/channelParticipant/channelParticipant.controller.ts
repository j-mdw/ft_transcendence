// import {
//   Controller,
//   Param,
//   ParseUUIDPipe,
//   Put,
//   Patch,
//   UseGuards,
//   Res,
//   Delete,
//   Get,
// } from '@nestjs/common';
// import {
//   ChannelParticipantDTO,
//   UpdateChannelParticipantDTO,
// } from './channelParticipant.dto';
// import { ChannelParticipantService } from './channelParticipant.service';
// import { JwtGuard } from 'src/auth/jwt.guard';
// import { Response } from 'express';

// @Controller('channelParticipant')
// @UseGuards(JwtGuard)
// export class UserController {
//   constructor(private channelParticipantService: ChannelParticipantService) {}
//   @Get()
//   findAll(): Promise<ChannelParticipantDTO[]> {
//     return this.channelParticipantService.findChannelParticpants(2);
//   }
//   @Put('/:channelId/:userId')
//   async addChannelParticipant(
//     @Param('channelId', ParseUUIDPipe) channelId: string,
//     @Param('userId', ParseUUIDPipe) userId: string,
//     @Res({ passthrough: true }) response: Response,
//   ): Promise<void> {
//     this.channelParticipantService.create(userId, channelId);
//   }
// }
