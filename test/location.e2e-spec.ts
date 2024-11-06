import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from '../src/entities/location.entity';
import { LocationService } from '../src/services/location.service';
import { LocationController } from '../src/controllers/location.controller';

describe('LocationController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Location],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Location]),
      ],
      controllers: [LocationController],
      providers: [LocationService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/locations (POST) should create a location', () => {
    return request(app.getHttpServer())
      .post('/api/v1/locations')
      .send({
        name: 'Test Location',
        locationNumber: 'T-01',
        area: 100.0,
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.name).toBe('Test Location');
        expect(res.body.locationNumber).toBe('T-01');
        expect(res.body.area).toBe(100.0);
      });
  });

  it('/api/v1/locations (GET) should return all locations', () => {
    return request(app.getHttpServer())
      .get('/api/v1/locations')
      .expect(200)
      .expect((res) => {
        expect(res.body).toBeInstanceOf(Array);
      });
  });

  it('/api/v1/locations/:id (GET) should return a single location', () => {
    return request(app.getHttpServer())
      .get('/api/v1/locations/1')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('name');
        expect(res.body).toHaveProperty('locationNumber');
        expect(res.body).toHaveProperty('area');
      });
  });

  it('/api/v1/locations/:id (PUT) should update a location', () => {
    return request(app.getHttpServer())
      .put('/api/v1/locations/1')
      .send({
        name: 'Updated Location',
        locationNumber: 'U-01',
        area: 200.0,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.name).toBe('Updated Location');
        expect(res.body.locationNumber).toBe('U-01');
        expect(res.body.area).toBe(200.0);
      });
  });

  it('/api/v1/locations/:id (DELETE) should delete a location', () => {
    return request(app.getHttpServer())
      .delete('/api/v1/locations/1')
      .expect(200);
  });

  it('/api/v1/locations (POST) should return 400 for invalid request', () => {
    return request(app.getHttpServer())
      .post('/api/v1/locations')
      .send({
        locationNumber: 'T-01',
        area: 100.0,
      })
      .expect(400);
  });

  it('/api/v1/locations/:id (GET) should return 404 for invalid ID', () => {
    return request(app.getHttpServer())
      .get('/api/v1/locations/999')
      .expect(404);
  });

  it('/api/v1/locations/:id (PUT) should return 404 for invalid ID', () => {
    return request(app.getHttpServer())
      .put('/api/v1/locations/999')
      .send({
        name: 'Updated Location',
        locationNumber: 'U-01',
        area: 200.0,
      })
      .expect(404);
  });

  it('/api/v1/locations/:id (DELETE) should return 404 for invalid ID', () => {
    return request(app.getHttpServer())
      .delete('/api/v1/locations/999')
      .expect(404);
  });
});
