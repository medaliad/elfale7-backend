import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { CreateFoodStockDto } from './dto/create-food-stock.dto';

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

  // Food Stock methods
  async addFoodStock(farmId: string, createFoodStockDto: CreateFoodStockDto, userId: string) {
    try {
      // Check if farm exists
      const farm = await this.findOne(farmId);

      // Check if farm belongs to the user
      if (farm.userId !== userId) {
        throw new ForbiddenException(`You don't have access to this farm`);
      }

      // Create food stock record
      return await this.prisma.foodStock.create({
        data: {
          ...createFoodStockDto,
          farmId,
        },
        include: {
          farm: true,
        },
      });
    } catch (error: unknown) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Failed to add food stock record: ${errorMessage}`);
    }
  }

  async findAllFoodStocks(farmId: string, userId: string) {
    try {
      // Check if farm exists
      const farm = await this.findOne(farmId);

      // Check if farm belongs to the user
      if (farm.userId !== userId) {
        throw new ForbiddenException(`You don't have access to this farm`);
      }

      // Get all food stock records for the farm
      return await this.prisma.foodStock.findMany({
        where: { farmId },
        orderBy: { createdAt: 'desc' },
        include: {
          farm: true,
        },
      });
    } catch (error: unknown) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Failed to fetch food stock records: ${errorMessage}`);
    }
  }

  async removeFoodStock(id: string, userId: string) {
    try {
      // Check if food stock exists
      const foodStock = await this.prisma.foodStock.findUnique({
        where: { id },
        include: {
          farm: true,
        },
      });

      if (!foodStock) {
        throw new NotFoundException(`Food stock record with ID ${id} not found`);
      }

      // Check if farm belongs to the user
      if (foodStock.farm.userId !== userId) {
        throw new ForbiddenException(`You don't have access to this food stock record`);
      }

      // Delete food stock record
      await this.prisma.foodStock.delete({
        where: { id },
      });

      return { message: 'Food stock record deleted successfully' };
    } catch (error: unknown) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Failed to delete food stock record: ${errorMessage}`);
    }
  }
}
