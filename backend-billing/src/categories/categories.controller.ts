import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sort') sort?: string,
  ) {
    return this.categoriesService.findAll(
      page ? +page : 1,
      limit ? +limit : 20,
      sort ?? 'name-asc',
    );
  }

  @Get('inactive')
  findInactive(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sort') sort?: string,
  ) {
    return this.categoriesService.findInactive(
      page ? +page : 1,
      limit ? +limit : 20,
      sort ?? 'name-asc',
    );
  }

  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.categoriesService.restore(+id);
  }

  @Get('search')
  search(
    @Query('query') query: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sort') sort?: string,
  ) {
    return this.categoriesService.search(
      query,
      status ?? 'active',
      page ? +page : 1,
      limit ? +limit : 20,
      sort ?? 'name-asc',
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
