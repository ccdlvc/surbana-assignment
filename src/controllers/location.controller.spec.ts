import { Test, TestingModule } from '@nestjs/testing';
import { LocationController } from './location.controller';
import { LocationService } from '../services/location.service';

const mockLocationService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn().mockResolvedValue(undefined),
};

describe('LocationController', () => {
  let controller: LocationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationController],
      providers: [
        {
          provide: LocationService,
          useValue: mockLocationService,
        },
      ],
    }).compile();

    controller = module.get<LocationController>(LocationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a location', async () => {
    const locationDto = {
      name: 'New Location',
      locationNumber: 'NL-01',
      area: 100.0,
    };
    mockLocationService.create.mockReturnValue(locationDto);

    const result = await controller.create(locationDto as any);
    expect(result).toEqual(locationDto);
  });

  it('should return all locations', async () => {
    const locations = [
      { name: 'Location 1', locationNumber: 'L-01', area: 100.0 },
    ];
    mockLocationService.findAll.mockReturnValue(locations);

    const result = await controller.findAll();
    expect(result).toEqual(locations);
  });

  it('should return a single location', async () => {
    const location = {
      id: 1,
      name: 'Location 1',
      locationNumber: 'L-01',
      area: 100.0,
    };
    mockLocationService.findOne.mockReturnValue(location);

    const result = await controller.findOne(1);
    expect(result).toEqual(location);
  });

  it('should update a location', async () => {
    const updateLocationDto = {
      name: 'Updated Location',
      locationNumber: 'UL-01',
      area: 200.0,
    };
    mockLocationService.update.mockReturnValue(updateLocationDto);

    const result = await controller.update(1, updateLocationDto as any);
    expect(result).toEqual(updateLocationDto);
  });

  it('should delete a location', async () => {
    const result = await controller.remove(1);
    expect(result).toBeUndefined();
  });

  it('should throw an error if location is not found', async () => {
    mockLocationService.findOne.mockRejectedValue(
      new Error('Location not found'),
    );

    await expect(controller.findOne(999)).rejects.toThrow();
  });
});
