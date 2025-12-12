import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { AnimalType, HealthStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class QueryAnimalDto {
  @ApiProperty({
    description: 'Page number',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({
    description: 'Items per page',
    example: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @ApiProperty({
    description: 'Animal type filter',
    enum: AnimalType,
    example: AnimalType.SHEEP,
    required: false,
  })
  @IsEnum(AnimalType)
  @IsOptional()
  type?: AnimalType;

  @ApiProperty({
    description: 'Animal health status filter',
    enum: HealthStatus,
    example: HealthStatus.HEALTHY,
    required: false,
  })
  @IsEnum(HealthStatus)
  @IsOptional()
  healthStatus?: HealthStatus;


  @ApiProperty({
    description: 'Search by name',
    example: 'Fluffy',
    required: false,
  })
  @IsString()
  @IsOptional()
  search?: string;
}
