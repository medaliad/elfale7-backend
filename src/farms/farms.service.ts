import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';

@Injectable()
export class FarmsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFarmDto: CreateFarmDto) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: createFarmDto.userId },
    });

    if (!user) {
      throw new BadRequestException(`User with ID ${createFarmDto.userId} not found`);
    }

    // Create farm
    return this.prisma.farm.create({
      data: createFarmDto,
      include: { animals: true },
    });
  }

  async findAll() {
    return this.prisma.farm.findMany({
      include: {
        animals: true,
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const farm = await this.prisma.farm.findUnique({
      where: { id },
      include: {
        animals: true,
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!farm) {
      throw new NotFoundException(`Farm with ID ${id} not found`);
    }

    return farm;
  }

  async findByUser(userId: string) {
    return this.prisma.farm.findMany({
      where: { userId },
      include: { animals: true },
    });
  }

  async update(id: string, updateFarmDto: UpdateFarmDto) {
    // Check if farm exists
    await this.findOne(id);

    // Update farm
    return this.prisma.farm.update({
      where: { id },
      data: updateFarmDto,
      include: { animals: true },
    });
  }

  async remove(id: string) {
    // Check if farm exists
    await this.findOne(id);

    // Delete farm
    await this.prisma.farm.delete({
      where: { id },
    });

    return { message: 'Farm deleted successfully' };
  }
}
