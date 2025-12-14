import { ApiProperty } from '@nestjs/swagger';
import { BreedingMethod } from '@prisma/client';

export class BreedingResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the breeding record',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'Date of breeding',
    example: '2025-01-01T00:00:00.000Z',
  })
  date!: Date;

  @ApiProperty({
    description: 'Method of breeding',
    enum: BreedingMethod,
    example: BreedingMethod.NATURAL,
  })
  method!: BreedingMethod;

  @ApiProperty({
    description: 'Additional notes about the breeding',
    example: 'First breeding attempt for this animal',
    required: false,
  })
  notes?: string;

  @ApiProperty({
    description: 'ID of the animal being bred',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  animalId!: string;

  @ApiProperty({
    description: 'ID of the partner animal (if applicable)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  partnerAnimalId?: string;

  @ApiProperty({
    description: 'When the record was created',
    example: '2025-01-01T00:00:00.000Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'When the record was last updated',
    example: '2025-01-01T00:00:00.000Z',
  })
  updatedAt!: Date;
}