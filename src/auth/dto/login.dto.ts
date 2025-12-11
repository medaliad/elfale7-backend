import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MinLength, ValidateIf } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
    required: false,
  })
  @IsEmail()
  @ValidateIf((o) => !o.phone)
  @IsNotEmpty({ message: 'Either email or phone is required' })
  email?: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+1234567890',
    required: false,
  })
  @IsPhoneNumber()
  @ValidateIf((o) => !o.email)
  @IsNotEmpty({ message: 'Either email or phone is required' })
  phone?: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}
