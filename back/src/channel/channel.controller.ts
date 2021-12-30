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
  ForbiddenException,
} from '@nestjs/common';
import {
  ChannelDTO,
  ChannelPasswordDTO,
  CreateChannelDTO,
  UpdateChannelDTO,
} from './channel.dto';
import { ChannelService } from './channel.service';
import { JwtGuard } from 'src/auth/jwt.guard';
import { Response } from 'express';
import {
  ChannelParticipantDTO,
  UpdateChannelParticipantDTO,
} from 'src/channelParticipant/channelParticipant.dto';
import { ChannelType } from './channel.entity';

@Controller('channel')
@UseGuards(JwtGuard)
export class ChannelController {
  constructor(private channelService: ChannelService) {}
  @Get() // Returns visible channels only
  async allVisibleChannels(): Promise<ChannelDTO[]> {
    return (await this.channelService.findAll())
      .filter((channel) => channel.type !== ChannelType.private)
      .map((channel) => new ChannelDTO(channel));
  }

  @Get(':channelId')
  async allChannelPatcitipants(
    @Param('channelId', ParseUUIDPipe) channelId: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ChannelParticipantDTO[]> {
    return (
      await this.channelService.findParticipants(response.locals.id, channelId)
    ).map((participant) => new ChannelParticipantDTO(participant));
  }

  @Put(':channelId/:participantId')
  async addChannelParticipant(
    @Param('channelId', ParseUUIDPipe) channelId: string,
    @Param('participantId', ParseUUIDPipe) participantId: string,
    @Res({ passthrough: true }) response: Response,
    @Body() password?: ChannelPasswordDTO,
  ): Promise<void> {
    await this.channelService.addParticipant(
      response.locals.id,
      participantId,
      channelId,
      password.password,
    );
  }

  @Put()
  async newChannel(
    @Res({ passthrough: true }) response: Response,
    @Body() data: CreateChannelDTO,
  ) {
    await this.channelService.create(response.locals.id, data);
  }

  @Patch(':channelId')
  async updateChannel(
    @Param('channelId', ParseUUIDPipe) channelId: string,
    @Res({ passthrough: true }) response: Response,
    @Body() data: UpdateChannelDTO,
  ) {
    await this.channelService.update(response.locals.id, channelId, data);
  }

  @Patch(':channelId/:userId')
  async updateChannelParticipant(
    @Param('channelId', ParseUUIDPipe) channelId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Res({ passthrough: true }) response: Response,
    @Body() data: UpdateChannelParticipantDTO,
  ) {
    await this.channelService.updateParticipant(
      response.locals.id,
      userId,
      channelId,
      data,
    );
  }

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
