import { ApiProperty } from '@nestjs/swagger';
import { AnimalType, HealthStatus } from '@prisma/client';

export class AnimalResponseDto {
  @ApiProperty({
    description: 'Animal ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'Animal name',
    example: 'Fluffy',
  })
  name!: string;

  @ApiProperty({
    description: 'Animal type',
    enum: AnimalType,
    example: AnimalType.SHEEP,
  })
  type!: AnimalType;

  @ApiProperty({
    description: 'Animal birth date',
    example: '2020-01-01T00:00:00.000Z',
    nullable: true,
  })
  birthDate!: Date | null;

  @ApiProperty({
    description: 'Animal weight in kg',
    example: 50.5,
    nullable: true,
  })
  weight!: number | null;

  @ApiProperty({
    description: 'Animal health status',
    enum: HealthStatus,
    example: HealthStatus.HEALTHY,
  })
  healthStatus!: HealthStatus;

  @ApiProperty({
    description: 'Farm ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  farmId!: string;

  @ApiProperty({
    description: 'Animal creation date',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Animal last update date',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt!: Date;
}
