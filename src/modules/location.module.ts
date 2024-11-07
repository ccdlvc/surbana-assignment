import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationService } from '../services/location.service';
import { LocationController } from '../controllers/location.controller';
import { Location } from '../entities/location.entity';
import { BuildingModule } from './building.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Location]),
    forwardRef(() => BuildingModule),
  ],
  providers: [LocationService],
  controllers: [LocationController],
  exports: [TypeOrmModule],
})
export class LocationModule {}
