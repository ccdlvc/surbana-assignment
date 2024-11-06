import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  name: string;

  @IsString()
  locationNumber: string;

  @IsNumber()
  area: number;

  @IsOptional()
  @IsNumber()
  parentId?: number;
}

export class UpdateLocationDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  locationNumber?: string;

  @IsNumber()
  @IsOptional()
  area?: number;

  @IsOptional()
  @IsNumber()
  parentId?: number;
}

export class ResponseDto<T> {
  errorCode: number;
  errorMessage: string;
  data: T;
}
