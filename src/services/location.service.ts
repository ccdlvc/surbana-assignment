import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from '../entities/location.entity';
import { CreateLocationDto, UpdateLocationDto } from '../dtos/location.dto';
import { Building } from '../entities/building.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    @InjectRepository(Building)
    private readonly buildingRepository: Repository<Building>,
  ) {}

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    const { buildingId, parentId } = createLocationDto;
    // Validate building exists
    const building = await this.buildingRepository.findOne({
      where: { id: buildingId },
    });
    if (!building) {
      throw new HttpException(
        `Building with ID ${buildingId} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }
    // Validate parent location, if any, belongs to the same building
    if (parentId) {
      const parentLocation = await this.locationRepository.findOne({
        where: { id: parentId },
      });
      if (!parentLocation) {
        throw new HttpException(
          `Parent location with ID ${parentId} not found`,
          HttpStatus.BAD_REQUEST,
        );
      }
      if (parentLocation.buildingId !== buildingId) {
        throw new HttpException(
          `Parent location's building ID does not match the provided building ID`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // Check for circular reference
      await this.checkCircularReference(null, parentId);
    }
    const location = this.locationRepository.create(createLocationDto);
    return this.locationRepository.save(location);
  }

  findAll(): Promise<Location[]> {
    return this.locationRepository.find({
      relations: ['building', 'parent', 'children'],
    });
  }

  async findOne(id: number): Promise<Location> {
    const location = await this.locationRepository.findOne({
      where: { id },
      relations: ['building', 'parent', 'children'],
    });
    if (!location) {
      throw new HttpException(
        `Location with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return location;
  }

  async update(
    id: number,
    updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    const location = await this.locationRepository.findOne({ where: { id } });
    if (!location) {
      throw new HttpException(
        `Location with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    const updatedLocationData = { ...location, ...updateLocationDto };
    const { buildingId, parentId } = updatedLocationData;
    // Check for circular reference
    await this.checkCircularReference(id, parentId);

    if (buildingId) {
      // Validate building exists
      const building = await this.buildingRepository.findOne({
        where: { id: buildingId },
      });
      if (!building) {
        throw new HttpException(
          `Building with ID ${buildingId} not found`,
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.validateBuildingConsistency(id, buildingId);
      // Validate parent location, if any, belongs to the same building
      if (parentId) {
        const parentLocation = await this.locationRepository.findOne({
          where: { id: parentId },
        });
        if (!parentLocation) {
          throw new HttpException(
            `Parent location with ID ${parentId} not found`,
            HttpStatus.BAD_REQUEST,
          );
        }
        if (parentLocation.buildingId !== buildingId) {
          throw new HttpException(
            `Parent location's building ID does not match the provided building ID`,
            HttpStatus.BAD_REQUEST,
          );
        }
      }
    }
    const updatedLocation = this.locationRepository.merge(
      location,
      updateLocationDto,
    );
    return this.locationRepository.save(updatedLocation);
  }

  async remove(id: number): Promise<void> {
    const result = await this.locationRepository.delete(id);
    if (result.affected === 0) {
      throw new HttpException(
        `Location with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  private async checkCircularReference(
    locationId: number,
    parentId: number,
  ): Promise<void> {
    if (locationId === parentId) {
      throw new HttpException(
        'Circular reference detected: A location cannot be its own parent.',
        HttpStatus.BAD_REQUEST,
      );
    }

    let currentParentId = parentId;
    while (currentParentId) {
      const parentLocation = await this.locationRepository.findOne({
        where: { id: currentParentId },
      });
      if (!parentLocation) {
        break;
      }
      if (parentLocation.id === locationId) {
        throw new HttpException(
          'Circular reference detected: A location cannot be its own ancestor.',
          HttpStatus.BAD_REQUEST,
        );
      }
      currentParentId = parentLocation.parentId;
    }
  }

  private async validateBuildingConsistency(
    locationId: number,
    buildingId: number,
  ): Promise<void> {
    const location = await this.locationRepository.findOne({
      where: { id: locationId },
      relations: ['parent', 'children'],
    });

    if (location.parent && location.parent.buildingId !== buildingId) {
      throw new HttpException(
        'Parent location belongs to a different building.',
        HttpStatus.BAD_REQUEST,
      );
    }

    for (const child of location.children) {
      if (child.buildingId !== buildingId) {
        throw new HttpException(
          'One or more child locations belong to a different building.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }
}
