import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { AnimalType, HealthStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class UpdateAnimalDto {
  @ApiProperty({
    description: 'Animal name',
    example: 'Fluffy',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Animal type',
    enum: AnimalType,
    example: AnimalType.SHEEP,
    required: false,
  })
  @IsEnum(AnimalType)
  @IsOptional()
  type?: AnimalType;

  @ApiProperty({
    description: 'Animal birth date',
    example: '2020-01-01T00:00:00.000Z',
    required: false,
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  birthDate?: Date;

  @ApiProperty({
    description: 'Animal weight in kg',
    example: 50.5,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  weight?: number;

  @ApiProperty({
    description: 'Animal health status',
    enum: HealthStatus,
    example: HealthStatus.HEALTHY,
    required: false,
  })
  @IsEnum(HealthStatus)
  @IsOptional()
  healthStatus?: HealthStatus;

  @ApiProperty({
    description: 'Farm ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  farmId?: string;
}
