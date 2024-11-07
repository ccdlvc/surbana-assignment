import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBuildingDto {
  @IsString()
  @ApiProperty({ example: 'A', description: 'The unique building name' })
  name: string;
}

export class UpdateBuildingDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'A', description: 'The unique building name' })
  name?: string;
}
