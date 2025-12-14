import { ApiProperty } from '@nestjs/swagger';

export class FoodStockResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the food stock',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'Name of the food stock',
    example: 'Hay',
  })
  name!: string;

  @ApiProperty({
    description: 'Quantity of food stock',
    example: 100,
  })
  quantity!: number;

  @ApiProperty({
    description: 'Unit of measurement',
    example: 'kg',
  })
  unit!: string;

  @ApiProperty({
    description: 'Farm ID that this food stock belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  farmId!: string;

  @ApiProperty({
    description: 'Expiry date of the food stock',
    example: '2026-01-01T00:00:00.000Z',
    required: false,
  })
  expiryDate?: Date;

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