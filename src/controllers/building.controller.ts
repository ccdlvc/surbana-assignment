import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { BuildingService } from '../services/building.service';
import { Building } from '../entities/building.entity';
import { CreateBuildingDto, UpdateBuildingDto } from '../dtos/building.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('buildings')
@Controller('api/v1/buildings')
export class BuildingController {
  constructor(private readonly buildingService: BuildingService) {}

  @Get()
  @ApiOperation({ summary: 'Get all buildings' })
  @ApiResponse({ status: 200, description: 'Return all buildings.' })
  findAll(): Promise<Building[]> {
    return this.buildingService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get building by ID' })
  @ApiResponse({ status: 200, description: 'Return the building.' })
  @ApiResponse({ status: 404, description: 'Building not found.' })
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.buildingService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new building' })
  @ApiResponse({
    status: 200,
    description: 'The building has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request.',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createBuildingDto: CreateBuildingDto): Promise<Building> {
    if (createBuildingDto.name.length > 10) {
      throw new HttpException(
        'Building Name must be smaller than 10 characters',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.buildingService.create(createBuildingDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a building' })
  @ApiResponse({
    status: 200,
    description: 'The building has been successfully updated.',
  })
  @ApiResponse({
    status: 404,
    description: 'Building not found.',
  })
  @ApiParam({ name: 'id', type: Number })
  @UsePipes(new ValidationPipe({ transform: true }))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBuildingDto: UpdateBuildingDto,
  ) {
    if (updateBuildingDto.name.length > 10) {
      throw new HttpException(
        'Building Name must be smaller than 10 characters',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.buildingService.update(id, updateBuildingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a building' })
  @ApiResponse({
    status: 200,
    description: 'The building has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Building not found.',
  })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.buildingService.remove(id);
  }
}
