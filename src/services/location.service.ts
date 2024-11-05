import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from '../entities/location.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}

  findAll(): Promise<Location[]> {
    return this.locationRepository.find();
  }

  findOne(id: number): Promise<Location> {
    return this.locationRepository.findOneBy({ id });
  }

  create(location: Location): Promise<Location> {
    return this.locationRepository.save(location);
  }

  async update(id: number, location: Location): Promise<Location> {
    await this.locationRepository.update(id, location);
    return this.locationRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.locationRepository.delete(id);
  }
}
