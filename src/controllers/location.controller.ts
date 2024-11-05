import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { Location } from '../entities/location.entity';
import { LocationService } from '../services/location.service';

@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  findAll(): Promise<Location[]> {
    return this.locationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Location> {
    return this.locationService.findOne(id);
  }

  @Post()
  create(@Body() location: Location): Promise<Location> {
    return this.locationService.create(location);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() location: Location): Promise<Location> {
    return this.locationService.update(id, location);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.locationService.remove(id);
  }
}
