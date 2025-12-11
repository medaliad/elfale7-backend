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
    // Check if farm exists
    const farm = await this.prisma.farm.findUnique({
      where: { id: createAnimalDto.farmId },
    });

    if (!farm) {
      throw new BadRequestException(`Farm with ID ${createAnimalDto.farmId} not found`);
    }

    // Create animal
    return this.prisma.animal.create({
      data: createAnimalDto,
    });
  }

  async findAll(query: QueryAnimalDto) {
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

    // Get animals
    const animals = await this.prisma.animal.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return {
      data: animals,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const animal = await this.prisma.animal.findUnique({
      where: { id },
    });

    if (!animal) {
      throw new NotFoundException(`Animal with ID ${id} not found`);
    }

    return animal;
  }

  async update(id: string, updateAnimalDto: UpdateAnimalDto) {
    // Check if animal exists
    await this.findOne(id);

    // Update animal
    return this.prisma.animal.update({
      where: { id },
      data: updateAnimalDto,
    });
  }

  async remove(id: string) {
    // Check if animal exists
    await this.findOne(id);

    // Delete animal
    await this.prisma.animal.delete({
      where: { id },
    });

    return { message: 'Animal deleted successfully' };
  }
}
