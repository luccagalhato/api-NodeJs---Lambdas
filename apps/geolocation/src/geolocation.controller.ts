import { Controller, Post, Body, Get, Param, UseGuards, Query } from '@nestjs/common';
import { Roles } from '../../shared/decorators/role.decorator';
import { AuthorizationGuard } from '../../shared/security/authorization.guard';
import Role from '../../shared/security/role.model';
import { RedisData } from '../../shared/interfaces';
import { GeolocationService } from './geolocation.service';

@Controller()
export class GeolocationController {
  constructor(private readonly geolocationService: GeolocationService) { }

  @Post()
  @UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER, Role.COLLABORATOR, Role.USER)
  setCache(@Body() redisData: RedisData): Promise<any> {
    return this.geolocationService.setCache(redisData);
  }

  @UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER, Role.COLLABORATOR, Role.USER)
  @Get('/google-map-api')
  async getGoogleMapsLocation(@Query() query: any) {
    return await this.geolocationService.getGoogleMapsLocation(query)
  }

  @Get('/:key')
  @UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER, Role.COLLABORATOR, Role.USER)
  async getByKey(@Param('key') key: string): Promise<any> {
    return await this.geolocationService.getByKey(key);
  }

  @Get('/all-by-prefix/:prefix')
  @UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER, Role.COLLABORATOR, Role.USER)
  async getAllByPrefix(@Param('prefix') prefix: string): Promise<any> {
    return await this.geolocationService.getAllByPrefix(prefix);
  }

}
