import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVaccineDto {
  @ApiProperty({
    description: 'Vaccine name',
    example: 'Rabies Vaccine',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: 'Date when the vaccine was administered',
    example: '2025-01-01T00:00:00.000Z',
  })
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  date!: Date;

  @ApiProperty({
    description: 'Additional notes about the vaccination',
    example: 'Annual vaccination for rabies prevention',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'ID of the animal that received the vaccine',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  animalId!: string;
}