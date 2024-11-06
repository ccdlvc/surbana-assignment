import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from '../entities/location.entity';
import { CreateLocationDto, UpdateLocationDto } from '../dtos/location.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    const location = plainToInstance(Location, createLocationDto);
    return this.locationRepository.save(location);
  }

  findAll(): Promise<Location[]> {
    return this.locationRepository.find({ relations: ['parent', 'children'] });
  }

  async findOne(id: number): Promise<Location> {
    const location = await this.locationRepository.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });
    if (!location) {
      throw new HttpException(`Location with ID ${id} not found`, 404);
    }
    return location;
  }

  async update(
    id: number,
    updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    await this.locationRepository.update(id, updateLocationDto);
    const updatedLocation = await this.locationRepository.findOne({
      where: { id },
    });
    if (!updatedLocation) {
      throw new HttpException(`Location with ID ${id} not found`, 404);
    }
    return updatedLocation;
  }

  async remove(id: number): Promise<void> {
    const result = await this.locationRepository.delete(id);
    if (result.affected === 0) {
      throw new HttpException(`Location with ID ${id} not found`, 404);
    }
  }
}
