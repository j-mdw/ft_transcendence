import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  Patch,
  UseGuards,
  Res,
  Delete,
  Query,
  Post,
  ForbiddenException,
} from '@nestjs/common';
import { ChannelDTO, CreateChannelDTO, UpdateChannelDTO } from './channel.dto';
import { ChannelService } from './channel.service';
import { JwtGuard } from 'src/auth/jwt.guard';
import { Response } from 'express';
import {
  ChannelParticipantDTO,
  UpdateChannelParticipantDTO,
} from 'src/channelParticipant/channelParticipant.dto';

@Controller('channel')
@UseGuards(JwtGuard)
export class ChannelController {
  constructor(private channelService: ChannelService) {}
  @Get() // Not sure we'll need this endpoint
  async allChannels(): Promise<ChannelDTO[]> {
    return (await this.channelService.findAll()).map(
      (channel) => new ChannelDTO(channel),
    );
  }

  // @Get(':channelId')
  // async allChannelPatcitipants(
  //   @Param('channelId', ParseUUIDPipe) channelId: string,
  //   @Res({ passthrough: true }) response: Response,
  // ) {
  //   return await this.channelService.findAllParticipants(channelId);
  // }

  @Put()
  async newChannel(
    @Res({ passthrough: true }) response: Response,
    @Body() data: CreateChannelDTO,
  ) {
    await this.channelService.create(response.locals.id, data);
  }

  // @Put(':channelId/:participantId')
  // async addChannelParticipant(
  //   @Param('channelId', ParseUUIDPipe) channelId: string,
  //   @Param('participantId', ParseUUIDPipe) participantId: string,
  //   @Res({ passthrough: true }) response: Response,
  //   @Body() password: string,
  // ): Promise<void> {
  //   this.channelService.addParticipant(
  //     response.locals.id,
  //     channelId,
  //     participantId,
  //     password,
  //   );
  // }

  @Patch(':channelId')
  async updateChannel(
    @Param('channelId', ParseUUIDPipe) channelId: string,
    @Res({ passthrough: true }) response: Response,
    @Body() data: UpdateChannelDTO,
  ) {
    await this.channelService.update(response.locals.id, channelId, data);
  }

  // @Patch(':channelId/:userId')
  // async updateChannelParticipant(
  //   @Param('channelId', ParseUUIDPipe) channelId: string,
  //   @Param('userId', ParseUUIDPipe) userId: string,
  //   @Res({ passthrough: true }) response: Response,
  //   @Body() data: UpdateChannelParticipantDTO,
  // ) {
  //   await this.channelService.update(response.locals.id, channelId, userId, data);
  // }

  @Delete(':channelId')
  async deleteChannel(
    @Param('channelId', ParseUUIDPipe) channelId: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.channelService.delete(response.locals.id, channelId);
  }

  @Delete(':channelId/:userId')
  async deleteParticipant(
    @Param('channelId', ParseUUIDPipe) channelId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (userId != response.locals.id) {
      throw new ForbiddenException('cannot remove another user');
    } else {
      await this.channelService.deleteParticipant(userId, channelId);
    }
  }
}
