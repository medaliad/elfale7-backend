import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { QueryAnimalDto } from './dto/query-animal.dto';

@Injectable()
export class AnimalsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAnimalDto: CreateAnimalDto) {
    try {
      // Check if farm exists
      const farm = await this.prisma.farm.findUnique({
        where: { id: createAnimalDto.farmId },
      });

      if (!farm) {
        throw new BadRequestException(`Farm with ID ${createAnimalDto.farmId} not found`);
      }

      // Create animal
      return await this.prisma.animal.create({
        data: createAnimalDto,
        include: {
          farm: true,
        },
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to create animal: ${error.message}`);
    }
  }

  async findAll(query: QueryAnimalDto) {
    try {
      const { page = 1, limit = 10, type, healthStatus, farmId, search } = query;
      const skip = (page - 1) * limit;

      // Build where clause
      const where: any = {};
      if (type) where.type = type;
      if (healthStatus) where.healthStatus = healthStatus;
      if (farmId) where.farmId = farmId;
      if (search) where.name = { contains: search, mode: 'insensitive' };

      // Get total count
      const total = await this.prisma.animal.count({ where });

      // Get animals with farm data
      const animals = await this.prisma.animal.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          farm: true,
        },
      });

      return {
        data: animals,
        meta: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
        },
      };
    } catch (error) {
      throw new BadRequestException(`Failed to fetch animals: ${error.message}`);
    }
  }

  async findOne(id: string) {
    try {
      const animal = await this.prisma.animal.findUnique({
        where: { id },
        include: {
          farm: true,
        },
      });

      if (!animal) {
        throw new NotFoundException(`Animal with ID ${id} not found`);
      }

      return animal;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to fetch animal: ${error.message}`);
    }
  }

  async update(id: string, updateAnimalDto: UpdateAnimalDto) {
    try {
      // Check if animal exists
      await this.findOne(id);

      // If farmId is provided, check if farm exists
      if ('farmId' in updateAnimalDto) {
        const farm = await this.prisma.farm.findUnique({
          where: { id: updateAnimalDto.farmId },
        });

        if (!farm) {
          throw new BadRequestException(`Farm with ID ${updateAnimalDto.farmId} not found`);
        }
      }

      // Update animal
      return await this.prisma.animal.update({
        where: { id },
        data: updateAnimalDto,
        include: {
          farm: true,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to update animal: ${error.message}`);
    }
  }

  async remove(id: string) {
    try {
      // Check if animal exists
      await this.findOne(id);

      // Delete animal
      await this.prisma.animal.delete({
        where: { id },
      });

      return { message: 'Animal deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to delete animal: ${error.message}`);
    }
  }
}
