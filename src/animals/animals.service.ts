import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { QueryAnimalDto } from './dto/query-animal.dto';
import { CreateVaccineDto } from './dto/create-vaccine.dto';
import { CreateBreedingDto } from './dto/create-breeding.dto';
import { User } from '../common/interfaces/user.interface';

@Injectable()
export class AnimalsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAnimalDto: CreateAnimalDto, user: User) {
    try {
      // Get user's default farm or first available farm
      const farm = await this.getUserDefaultFarm(user.id);

      if (!farm) {
        throw new BadRequestException('No farms found for this user. Please create a farm first.');
      }

      // Create animal with farm from user's token
      return await this.prisma.animal.create({
        data: {
          ...createAnimalDto,
          farmId: farm.id,
        },
        include: {
          farm: true,
        },
      });
    } catch (error: unknown) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Failed to create animal: ${errorMessage}`);
    }
  }

  async findAll(query: QueryAnimalDto, user: User) {
    try {
      const { page = 1, limit = 10, type, healthStatus, search } = query;
      const skip = (page - 1) * limit;

      // Build where clause
      const where: any = {};
      if (type) where.type = type;
      if (healthStatus) where.healthStatus = healthStatus;
      
      // Only show animals from farms owned by the user
      where.farm = {
        userId: user.id,
      };
      
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Failed to fetch animals: ${errorMessage}`);
    }
  }

  async findOne(id: string, user: User) {
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

      // Check if the animal belongs to the user
      if (animal.farm.userId !== user.id) {
        throw new ForbiddenException(`You don't have access to this animal`);
      }

      return animal;
    } catch (error: unknown) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Failed to fetch animal: ${errorMessage}`);
    }
  }

  async update(id: string, updateAnimalDto: UpdateAnimalDto, user: User) {
    try {
      // Check if animal exists and belongs to the user
      await this.findOne(id, user);

      // Update animal
      return await this.prisma.animal.update({
        where: { id },
        data: updateAnimalDto,
        include: {
          farm: true,
        },
      });
    } catch (error: unknown) {
      if (error instanceof NotFoundException || error instanceof BadRequestException || error instanceof ForbiddenException) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Failed to update animal: ${errorMessage}`);
    }
  }

  async remove(id: string, user: User) {
    try {
      // Check if animal exists and belongs to the user
      await this.findOne(id, user);

      // Delete animal
      await this.prisma.animal.delete({
        where: { id },
      });

      return { message: 'Animal deleted successfully' };
    } catch (error: unknown) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Failed to delete animal: ${errorMessage}`);
    }
  }

  private async getUserDefaultFarm(userId: string) {
    // Get the first farm for the user
    // In a real application, you might want to have a "default" flag on the farm model
    return await this.prisma.farm.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Vaccine methods
  async addVaccine(animalId: string, createVaccineDto: CreateVaccineDto, user: User) {
    try {
      // Check if animal exists and belongs to the user
      await this.findOne(animalId, user);

      // Create vaccine record
      return await this.prisma.vaccine.create({
        data: {
          ...createVaccineDto,
          animalId,
        },
        include: {
          animal: true,
        },
      });
    } catch (error: unknown) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Failed to add vaccine record: ${errorMessage}`);
    }
  }

  async findAllVaccines(animalId: string, user: User) {
    try {
      // Check if animal exists and belongs to the user
      await this.findOne(animalId, user);

      // Get all vaccine records for the animal
      return await this.prisma.vaccine.findMany({
        where: { animalId },
        orderBy: { date: 'desc' },
        include: {
          animal: true,
        },
      });
    } catch (error: unknown) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Failed to fetch vaccine records: ${errorMessage}`);
    }
  }

  // Breeding methods
  async addBreeding(animalId: string, createBreedingDto: CreateBreedingDto, user: User) {
    try {
      // Check if animal exists and belongs to the user
      await this.findOne(animalId, user);

      // If partnerAnimalId is provided, check if it exists and belongs to the user
      if (createBreedingDto.partnerAnimalId) {
        await this.findOne(createBreedingDto.partnerAnimalId, user);
      }

      // Create breeding record
      return await this.prisma.breeding.create({
        data: {
          ...createBreedingDto,
          animalId,
        },
        include: {
          animal: true,
        },
      });
    } catch (error: unknown) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Failed to add breeding record: ${errorMessage}`);
    }
  }

  async findAllBreedings(animalId: string, user: User) {
    try {
      // Check if animal exists and belongs to the user
      await this.findOne(animalId, user);

      // Get all breeding records for the animal
      return await this.prisma.breeding.findMany({
        where: { animalId },
        orderBy: { date: 'desc' },
        include: {
          animal: true,
        },
      });
    } catch (error: unknown) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Failed to fetch breeding records: ${errorMessage}`);
    }
  }
}