import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLocationDto {
  @IsString()
  @ApiProperty({ example: 'Level 1', description: 'The name of the location' })
  name: string;

  @IsString()
  @ApiProperty({ example: 'A-01', description: 'The unique location number' })
  locationNumber: string;

  @IsNumber()
  @ApiProperty({
    example: 100.92,
    description: 'The area of the location in square meters',
  })
  area: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 1, description: 'The ID of the parent location' })
  parentId?: number;

  @ApiProperty({ example: 1, description: 'The ID of the building' })
  @IsNumber()
  @IsNotEmpty()
  buildingId: number;
}

export class UpdateLocationDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Level 1', description: 'The name of the location' })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'A-01', description: 'The unique location number' })
  locationNumber?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 100.92,
    description: 'The area of the location in square meters',
  })
  area?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    example: 1,
    description: 'The ID of the parent location',
    required: false,
  })
  parentId?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    example: 1,
    description: 'The ID of the building',
    required: false,
  })
  buildingId: number;
}
