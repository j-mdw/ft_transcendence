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
} from '@nestjs/common';
import { ChannelDTO, CreateChannelDTO, UpdateChannelDTO } from './channel.dto';
import { ChannelService } from './channel.service';
import { JwtGuard } from 'src/auth/jwt.guard';
import { Response } from 'express';

@Controller('channel')
@UseGuards(JwtGuard)
export class ChannelController {
  constructor(private channelService: ChannelService) {}
  @Get()
  async allChannels(): Promise<ChannelDTO[]> {
    return await this.channelService.findAll();
  }

  @Put()
  async newChannel(
    @Res({ passthrough: true }) response: Response,
    @Body() data: CreateChannelDTO,
  ) {
    await this.channelService.create(response.locals.id, data);
  }

  @Patch()
  async updateChannel(
    @Param('id', ParseUUIDPipe) channelId: string,
    @Res({ passthrough: true }) response: Response,
    @Body() data: UpdateChannelDTO,
  ) {
    await this.channelService.update(response.locals.id, channelId, data);
  }

  @Delete()
  async deleteChannel(
    @Param('id', ParseUUIDPipe) channelId: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.channelService.delete(response.locals.id, channelId);
  }
}
