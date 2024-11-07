import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Any } from 'typeorm';

export class ResponseDto<T> {
  @IsNumber()
  @ApiProperty({
    example: 0,
    description: 'Error code return to client',
  })
  errorCode: number;

  @IsString()
  @ApiProperty({
    example: 'Success',
    description: 'Error message return to client',
  })
  errorMessage: string;

  @ApiProperty({ example: Any, description: 'Data return to client' })
  data: T;
}
