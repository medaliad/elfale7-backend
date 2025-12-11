import { ApiProperty } from '@nestjs/swagger';

export class FarmResponseDto {
  @ApiProperty({
    description: 'Farm ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'Farm name',
    example: 'Green Valley Farm',
  })
  name!: string;

  @ApiProperty({
    description: 'Farm location',
    example: 'Countryside, CA',
    nullable: true,
  })
  location!: string | null;

  @ApiProperty({
    description: 'Farm description',
    example: 'A beautiful farm with sheep and goats',
    nullable: true,
  })
  description!: string | null;

  @ApiProperty({
    description: 'User ID (owner)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId!: string;

  @ApiProperty({
    description: 'Farm creation date',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Farm last update date',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt!: Date;
}
