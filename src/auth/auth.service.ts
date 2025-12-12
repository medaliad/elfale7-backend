import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { OnboardingDto } from './dto/onboarding.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(identifier: string, password: string, isPhone = false) {
    const user = await this.prisma.user.findUnique({
      where: isPhone ? { phone: identifier } : { email: identifier },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Remove password from user object
    const { password: _, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    // Check if login is with email or phone
    const isPhone = !loginDto.email && !!loginDto.phone;
    const identifier = isPhone ? loginDto.phone! : loginDto.email!;
    
    const user = await this.validateUser(identifier, loginDto.password, isPhone);
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken ,);
    return {tokens,user};
  }

  async register(registerDto: RegisterDto) {
    // Check if user already exists by email
    const userExistsByEmail = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (userExistsByEmail) {
      throw new BadRequestException('User with this email already exists');
    }

    // Check if user already exists by phone (if provided)
    if (registerDto.phone) {
      const userExistsByPhone = await this.prisma.user.findUnique({
        where: { phone: registerDto.phone },
      });

      if (userExistsByPhone) {
        throw new BadRequestException('User with this phone number already exists');
      }
    }

    // Hash password
    const hashedPassword = await this.hashData(registerDto.password);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        phone: registerDto.phone,
        password: hashedPassword,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        role: Role.USER,
      },
    });

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { refreshTokens: true },
    });

    if (!user || !user.refreshTokens.length) {
      throw new ForbiddenException('Access denied');
    }

    // Find the refresh token in the database
    const refreshTokenExists = user.refreshTokens.some(async (token) => {
      const isMatch = await bcrypt.compare(refreshToken, token.token);
      return isMatch;
    });

    if (!refreshTokenExists) {
      throw new ForbiddenException('Access denied');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string) {
    // Delete all refresh tokens for the user
    await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });
    return { message: 'Logged out successfully' };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    // Hash refresh token
    const hashedRefreshToken = await this.hashData(refreshToken);

    // Delete expired tokens
    await this.prisma.refreshToken.deleteMany({
      where: {
        userId,
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    // Calculate expiration date
    const expiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '7d';
    const expiresAt = new Date();
    if (expiresIn.endsWith('d')) {
      expiresAt.setDate(expiresAt.getDate() + parseInt(expiresIn.slice(0, -1)));
    } else if (expiresIn.endsWith('h')) {
      expiresAt.setHours(expiresAt.getHours() + parseInt(expiresIn.slice(0, -1)));
    } else if (expiresIn.endsWith('m')) {
      expiresAt.setMinutes(expiresAt.getMinutes() + parseInt(expiresIn.slice(0, -1)));
    }

    // Save refresh token
    await this.prisma.refreshToken.create({
      data: {
        token: hashedRefreshToken,
        userId,
        expiresAt,
      },
    });
  }

  async getTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION') || '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async hashData(data: string) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(data, salt);
  }

  async completeOnboarding(userId: string, onboardingDto: OnboardingDto) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { farms: true },
    });

    if (!user) {
      throw new BadRequestException(`User with ID ${userId} not found`);
    }

    // Check if user already has a farm
    if (user.farms.length > 0) {
      throw new BadRequestException('User already has a farm');
    }

    // Create farm for the user
    const farm = await this.prisma.farm.create({
      data: {
        name: onboardingDto.farmName,
        location: onboardingDto.farmLocation,
        description: onboardingDto.farmDescription,
        userId: userId,
      },
    });

    return {
      message: 'Onboarding completed successfully',
      farm: {
        id: farm.id,
        name: farm.name,
        location: farm.location,
        description: farm.description,
      },
    };
  }
}
