import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LocationService } from '../services/location.service';
import { CreateLocationDto, UpdateLocationDto } from '../dtos/location.dto';

@Controller('api/v1/locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createLocationDto: CreateLocationDto) {
    if (createLocationDto.name.length > 10) {
      throw new HttpException(
        'Location Name must be smaller than 10 characters',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.locationService.create(createLocationDto);
  }

  @Get()
  findAll() {
    return this.locationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.locationService.findOne(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    if (updateLocationDto.name.length > 10) {
      throw new HttpException(
        'Location Name must be smaller than 10 characters',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.locationService.update(id, updateLocationDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.locationService.remove(id);
  }
}
