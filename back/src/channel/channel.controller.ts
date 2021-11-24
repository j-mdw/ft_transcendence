import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { ChannelDTO, CreateChannelDTO } from './channel.dto';
import { ChannelService } from './channel.service';

@Controller('channel')
export class ChannelController {
  constructor(private channelService: ChannelService) {}
  @Get()
  async allChannels(): Promise<ChannelDTO[]> {
    return await this.channelService.findAll();
  }

  @Put()
  async newChannel(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: CreateChannelDTO,
  ) {
    await this.channelService.create(data, id);
  }
}
