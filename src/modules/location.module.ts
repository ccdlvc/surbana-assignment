import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationService } from '../services/location.service';
import { LocationController } from '../controllers/location.controller';
import { Location } from '../entities/location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Location])],
  providers: [LocationService],
  controllers: [LocationController],
})
export class LocationModule {}
