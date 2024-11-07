import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Building } from '../entities/building.entity';
import { CreateBuildingDto, UpdateBuildingDto } from '../dtos/building.dto';
import { plainToInstance } from 'class-transformer';
import { Location } from '../entities/location.entity';

@Injectable()
export class BuildingService {
  constructor(
    @InjectRepository(Building)
    private buildingRepository: Repository<Building>,

    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}

  findAll(): Promise<Building[]> {
    return this.buildingRepository.find({ relations: ['locations'] });
  }

  async findOne(id: number): Promise<Building> {
    const building = this.buildingRepository.findOne({
      where: { id },
      relations: ['locations'],
    });
    if (!building) {
      throw new HttpException(
        `Building with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return building;
  }

  async create(createBuildingDto: CreateBuildingDto): Promise<Building> {
    const building = plainToInstance(Building, createBuildingDto);
    return this.buildingRepository.save(building);
  }

  async update(
    id: number,
    updateBuildingDto: UpdateBuildingDto,
  ): Promise<Building> {
    await this.buildingRepository.update(id, updateBuildingDto);
    const updatedBuilding = await this.buildingRepository.findOne({
      where: { id },
    });
    if (!updatedBuilding) {
      throw new HttpException(
        `Building with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return updatedBuilding;
  }

  async remove(id: number): Promise<void> {
    const locations = await this.locationRepository.find({
      where: { buildingId: id },
    });
    if (locations.length > 0) {
      throw new HttpException(
        'Cannot delete building with associated locations',
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.buildingRepository.delete(id);
    if (result.affected === 0) {
      throw new HttpException(
        `Building with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
