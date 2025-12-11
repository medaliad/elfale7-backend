import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateFarmDto {
  @ApiProperty({
    description: 'Farm name',
    example: 'Green Valley Farm',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Farm location',
    example: 'Countryside, CA',
    required: false,
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({
    description: 'Farm description',
    example: 'A beautiful farm with sheep and goats',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
