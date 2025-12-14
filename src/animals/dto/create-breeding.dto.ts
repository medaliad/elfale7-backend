import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { BreedingMethod } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateBreedingDto {
  @ApiProperty({
    description: 'Date of breeding',
    example: '2025-01-01T00:00:00.000Z',
  })
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  date!: Date;

  @ApiProperty({
    description: 'Method of breeding',
    enum: BreedingMethod,
    example: BreedingMethod.NATURAL,
  })
  @IsEnum(BreedingMethod)
  @IsNotEmpty()
  method!: BreedingMethod;

  @ApiProperty({
    description: 'Additional notes about the breeding',
    example: 'First breeding attempt for this animal',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({
    description: 'ID of the animal being bred',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  animalId!: string;

  @ApiProperty({
    description: 'ID of the partner animal (if applicable)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  partnerAnimalId?: string;
}