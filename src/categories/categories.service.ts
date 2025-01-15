import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly catRepo: Repository<CategoryEntity>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const slug = createCategoryDto.title
        .replaceAll(/ |_/g, '-')
        .toLowerCase();

      const newCategory = this.catRepo.create({ slug, ...createCategoryDto });
      await this.catRepo.save(newCategory);

      return newCategory;
    } catch (error) {
      if (error.code == 23505) {
        throw new BadRequestException(
          'category with this title already exist !',
        );
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(queries: { limit: number; page: number }) {
    try {
      if (isNaN(queries.limit)) {
        queries.limit = 100;
      }
      if (isNaN(queries.page)) {
        queries.page = 1;
      }

      const categories = await this.catRepo.find({
        take: queries.limit,
        skip: (queries.page - 1) * queries.limit,
      });

      return categories;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      if (!id) {
        throw new NotFoundException('category not found.');
      }

      const slug = updateCategoryDto.title
        .replaceAll(/ |_/g, '-')
        .toLowerCase();

      const result = await this.catRepo.update(
        { id },
        { ...updateCategoryDto, slug },
      );
      if (!result.affected) {
        throw new NotFoundException('category not found.');
      }

      return { message: 'category updated.' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number) {
    try {
      if (!id) {
        throw new NotFoundException('category not found.');
      }

      const result = await this.catRepo.delete({ id });
      if (!result.affected) {
        throw new NotFoundException('category not found.');
      }

      return { message: 'category removed.' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
