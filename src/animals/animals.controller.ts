import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../common/interfaces/user.interface';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AnimalsService } from './animals.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { AnimalResponseDto } from './dto/animal-response.dto';
import { QueryAnimalDto } from './dto/query-animal.dto';
import { CreateVaccineDto } from './dto/create-vaccine.dto';
import { VaccineResponseDto } from './dto/vaccine-response.dto';
import { CreateBreedingDto } from './dto/create-breeding.dto';
import { BreedingResponseDto } from './dto/breeding-response.dto';

@ApiTags('animals')
@Controller('animals')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new animal' })
  @ApiResponse({
    status: 201,
    description: 'Animal has been successfully created',
    type: AnimalResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Farm not found',
  })
  create(@Body() createAnimalDto: CreateAnimalDto, @CurrentUser() user: User) {
    return this.animalsService.create(createAnimalDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all animals with pagination and filters' })
  @ApiResponse({
    status: 200,
    description: 'Return all animals',
    type: AnimalResponseDto,
    isArray: true,
  })
  findAll(@Query() query: QueryAnimalDto, @CurrentUser() user: User) {
    return this.animalsService.findAll(query, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an animal by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the animal',
    type: AnimalResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Animal not found',
  })
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.animalsService.findOne(id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an animal' })
  @ApiResponse({
    status: 200,
    description: 'Animal has been successfully updated',
    type: AnimalResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Animal not found',
  })
  update(@Param('id') id: string, @Body() updateAnimalDto: UpdateAnimalDto, @CurrentUser() user: User) {
    return this.animalsService.update(id, updateAnimalDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an animal' })
  @ApiResponse({
    status: 200,
    description: 'Animal has been successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Animal not found',
  })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.animalsService.remove(id, user);
  }

  // Vaccine endpoints
  @Post(':id/vaccines')
  @ApiOperation({ summary: 'Add a vaccine record for an animal' })
  @ApiResponse({
    status: 201,
    description: 'Vaccine record has been successfully created',
    type: VaccineResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Animal not found',
  })
  addVaccine(
    @Param('id') id: string,
    @Body() createVaccineDto: CreateVaccineDto,
    @CurrentUser() user: User,
  ) {
    return this.animalsService.addVaccine(id, createVaccineDto, user);
  }

  @Get(':id/vaccines')
  @ApiOperation({ summary: 'Get all vaccine records for an animal' })
  @ApiResponse({
    status: 200,
    description: 'Return all vaccine records for the animal',
    type: VaccineResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'Animal not found',
  })
  findAllVaccines(@Param('id') id: string, @CurrentUser() user: User) {
    return this.animalsService.findAllVaccines(id, user);
  }

  // Breeding endpoints
  @Post(':id/breedings')
  @ApiOperation({ summary: 'Add a breeding record for an animal' })
  @ApiResponse({
    status: 201,
    description: 'Breeding record has been successfully created',
    type: BreedingResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Animal not found',
  })
  addBreeding(
    @Param('id') id: string,
    @Body() createBreedingDto: CreateBreedingDto,
    @CurrentUser() user: User,
  ) {
    return this.animalsService.addBreeding(id, createBreedingDto, user);
  }

  @Get(':id/breedings')
  @ApiOperation({ summary: 'Get all breeding records for an animal' })
  @ApiResponse({
    status: 200,
    description: 'Return all breeding records for the animal',
    type: BreedingResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'Animal not found',
  })
  findAllBreedings(@Param('id') id: string, @CurrentUser() user: User) {
    return this.animalsService.findAllBreedings(id, user);
  }
}
