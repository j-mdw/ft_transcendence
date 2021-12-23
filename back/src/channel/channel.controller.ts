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
} from '@nestjs/common';
import { ChannelDTO, CreateChannelDTO, UpdateChannelDTO } from './channel.dto';
import { ChannelService } from './channel.service';
import { JwtGuard } from 'src/auth/jwt.guard';
import { Response } from 'express';
import { ChannelParticipantDTO } from 'src/channelParticipant/channelParticipant.dto';

@Controller('channel')
@UseGuards(JwtGuard)
export class ChannelController {
  constructor(private channelService: ChannelService) {}
  @Get()
  allChannels(): Promise<ChannelDTO[]> {
    return this.channelService.findAll();
  }

  // @Get(':channelId')
  // allParticipants(
  //   @Param('channelId', ParseUUIDPipe) channelId: string,
  // ): Promise<ChannelParticipantDTO> {
  //   return;
  // }

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

  @Delete(':channelId')
  async deleteChannel(
    @Param('channelId', ParseUUIDPipe) channelId: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.channelService.delete(response.locals.id, channelId);
  }
}
