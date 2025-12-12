import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class OnboardingDto {
  @ApiProperty({
    description: 'Name of the farm',
    example: 'Green Valley Farm',
  })
  @IsNotEmpty()
  @IsString()
  farmName: string;

  @ApiProperty({
    description: 'Location of the farm',
    example: 'Countryside, State',
    required: false,
  })
  @IsOptional()
  @IsString()
  farmLocation?: string;

  @ApiProperty({
    description: 'Description of the farm',
    example: 'A small family-owned farm with sheep and goats',
    required: false,
  })
  @IsOptional()
  @IsString()
  farmDescription?: string;
}
