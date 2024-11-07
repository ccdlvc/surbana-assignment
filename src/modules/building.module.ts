import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Building } from '../entities/building.entity';
import { BuildingService } from '../services/building.service';
import { BuildingController } from '../controllers/building.controller';
import { LocationModule } from './location.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Building]),
    forwardRef(() => LocationModule),
  ],
  providers: [BuildingService],
  controllers: [BuildingController],
  exports: [TypeOrmModule],
})
export class BuildingModule {}
