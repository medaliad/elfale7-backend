import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { FarmsService } from './farms.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { FarmResponseDto } from './dto/farm-response.dto';
import { CreateFoodStockDto } from './dto/create-food-stock.dto';
import { FoodStockResponseDto } from './dto/food-stock-response.dto';

@ApiTags('farms')
@Controller('farms')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class FarmsController {
  constructor(private readonly farmsService: FarmsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new farm' })
  @ApiResponse({
    status: 201,
    description: 'Farm has been successfully created',
    type: FarmResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'User not found',
  })
  create(@Body() createFarmDto: CreateFarmDto, @CurrentUser() user: { id: string }) {
    // Set the userId from the authenticated user
    createFarmDto.userId = user.id;
    return this.farmsService.create(createFarmDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all farms' })
  @ApiResponse({
    status: 200,
    description: 'Return all farms',
    type: FarmResponseDto,
    isArray: true,
  })
  findAll() {
    return this.farmsService.findAll();
  }

  @Get('my-farms')
  @ApiOperation({ summary: 'Get all farms owned by the current user' })
  @ApiResponse({
    status: 200,
    description: 'Return all farms owned by the current user',
    type: FarmResponseDto,
    isArray: true,
  })
  findMyFarms(@CurrentUser() user: { id: string }) {
    return this.farmsService.findByUser(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a farm by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the farm',
    type: FarmResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Farm not found',
  })
  findOne(@Param('id') id: string) {
    return this.farmsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a farm' })
  @ApiResponse({
    status: 200,
    description: 'Farm has been successfully updated',
    type: FarmResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Farm not found',
  })
  update(@Param('id') id: string, @Body() updateFarmDto: UpdateFarmDto) {
    return this.farmsService.update(id, updateFarmDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a farm' })
  @ApiResponse({
    status: 200,
    description: 'Farm has been successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Farm not found',
  })
  remove(@Param('id') id: string) {
    return this.farmsService.remove(id);
  }

  // Food Stock endpoints
  @Post(':id/food-stocks')
  @ApiOperation({ summary: 'Add a food stock record for a farm' })
  @ApiResponse({
    status: 201,
    description: 'Food stock record has been successfully created',
    type: FoodStockResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Farm not found',
  })
  addFoodStock(
    @Param('id') id: string,
    @Body() createFoodStockDto: CreateFoodStockDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.farmsService.addFoodStock(id, createFoodStockDto, user.id);
  }

  @Get(':id/food-stocks')
  @ApiOperation({ summary: 'Get all food stock records for a farm' })
  @ApiResponse({
    status: 200,
    description: 'Return all food stock records for the farm',
    type: FoodStockResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'Farm not found',
  })
  findAllFoodStocks(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.farmsService.findAllFoodStocks(id, user.id);
  }

  @Delete('food-stocks/:id')
  @ApiOperation({ summary: 'Delete a food stock record' })
  @ApiResponse({
    status: 200,
    description: 'Food stock record has been successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Food stock record not found',
  })
  removeFoodStock(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.farmsService.removeFoodStock(id, user.id);
  }
}
