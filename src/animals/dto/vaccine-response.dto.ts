import { ApiProperty } from '@nestjs/swagger';

export class VaccineResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the vaccine record',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'Vaccine name',
    example: 'Rabies Vaccine',
  })
  name!: string;

  @ApiProperty({
    description: 'Date when the vaccine was administered',
    example: '2025-01-01T00:00:00.000Z',
  })
  date!: Date;

  @ApiProperty({
    description: 'Additional notes about the vaccination',
    example: 'Annual vaccination for rabies prevention',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'ID of the animal that received the vaccine',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  animalId!: string;

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