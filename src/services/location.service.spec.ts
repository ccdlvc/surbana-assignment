import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LocationService } from './location.service';
import { Location } from '../entities/location.entity';

const mockLocationRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn().mockReturnValue({ affected: 1 }),
  remove: jest.fn().mockReturnValue({ affected: 1 }),
};

describe('LocationService', () => {
  let service: LocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationService,
        {
          provide: getRepositoryToken(Location),
          useValue: mockLocationRepository,
        },
      ],
    }).compile();

    service = module.get<LocationService>(LocationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new location', async () => {
    const locationDto = {
      name: 'New Location',
      locationNumber: 'NL-01',
      area: 100.0,
    };
    mockLocationRepository.save.mockReturnValue(locationDto);

    const result = await service.create(locationDto as any);
    expect(result).toEqual(locationDto);
  });

  it('should return all locations', async () => {
    const locations = [
      { name: 'Location 1', locationNumber: 'L-01', area: 100.0 },
    ];
    mockLocationRepository.find.mockReturnValue(locations);

    const result = await service.findAll();
    expect(result).toEqual(locations);
  });

  it('should return a single location', async () => {
    const location = {
      id: 1,
      name: 'Location 1',
      locationNumber: 'L-01',
      area: 100.0,
    };
    mockLocationRepository.findOne.mockReturnValue(location);

    const result = await service.findOne(1);
    expect(result).toEqual(location);
  });

  it('should update a location', async () => {
    const updateLocationDto = {
      name: 'Updated Location',
      locationNumber: 'UL-01',
      area: 200.0,
    };
    mockLocationRepository.update.mockReturnValue({ affected: 1 });
    mockLocationRepository.findOne.mockReturnValue(updateLocationDto);

    const result = await service.update(1, updateLocationDto as any);
    expect(result).toEqual(updateLocationDto);
  });

  it('should delete a location', async () => {
    const result = await service.remove(1);
    expect(result).toBeUndefined();
  });

  it('should throw an error if location is not found', async () => {
    mockLocationRepository.findOne.mockReturnValue(undefined);

    await expect(service.findOne(999)).rejects.toThrow();
  });
});
