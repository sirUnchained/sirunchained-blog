import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TagEntity } from './entities/tag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepo: Repository<TagEntity>,
  ) {}

  async create(createTagDto: CreateTagDto) {
    try {
      const slug = createTagDto.name.toLowerCase();
      const tag = this.tagRepo.create({ name: createTagDto.name, slug });
      await this.tagRepo.save(tag);
      return tag;
    } catch (error) {
      if (error.code == 23505) {
        throw new BadRequestException(
          'invalid data, try to chose another name.',
        );
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(queries: { limit: number; page: number }) {
    try {
      if (isNaN(queries.limit)) queries.limit = 10;
      if (isNaN(queries.page)) queries.page = 1;

      const tags = await this.tagRepo.find({
        take: queries.limit,
        skip: (queries.page - 1) * queries.limit,
      });

      return tags;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      if (!id || id <= 0) {
        throw new NotFoundException('tag not found.');
      }

      const tag = await this.tagRepo.findOneBy({ id });
      if (!tag) {
        throw new NotFoundException('tag not found.');
      }

      return tag;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    try {
      if (!id || id <= 0) {
        throw new NotFoundException('tag not found.');
      }

      const result = await this.tagRepo.update(
        { id },
        { name: updateTagDto.name },
      );
      if (!result.affected) {
        throw new NotFoundException('tag not found.');
      }

      return 'done.';
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number) {
    try {
      if (!id || id <= 0) {
        throw new NotFoundException('tag not found.');
      }

      const result = await this.tagRepo.delete({ id });
      if (!result.affected) {
        throw new NotFoundException('tag not found.');
      }

      return 'done.';
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
