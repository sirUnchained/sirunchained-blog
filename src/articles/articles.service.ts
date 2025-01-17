import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from './entities/article.entity';
import { In, Repository } from 'typeorm';
import { CategoryEntity } from 'src/categories/entities/category.entity';
import { TagEntity } from 'src/tags/entities/tag.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepo: Repository<ArticleEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,
    @InjectRepository(TagEntity)
    private readonly tagRepo: Repository<TagEntity>,
  ) {}

  async create(
    createArticleDto: CreateArticleDto,
    file: Express.Multer.File,
    req: any,
  ) {
    try {
      const { title, description, content, category } = createArticleDto;

      if (isNaN(category)) {
        throw new NotFoundException('category not found.');
      }

      let tagIds = createArticleDto.tags as any;
      tagIds = JSON.parse(tagIds) as number[];
      tagIds = tagIds.map((item) => !isNaN(item) && +item);
      const tags = await this.tagRepo.find({ where: { id: In(tagIds) } });

      let isPublished = createArticleDto.isPublished === '1';

      const slug = title.replaceAll(/ |_/g, '-').toLowerCase();
      const author = req.user;

      let filePath: string | null = null;
      if (file && file.filename) filePath = file.filename;

      const checkCategory = await this.categoryRepo.findOne({
        where: { id: category },
      });
      if (!checkCategory) {
        throw new NotFoundException('category not found.');
      }

      const newArticle = this.articleRepo.create({
        title,
        slug,
        description,
        cover: filePath,
        content,
        category: checkCategory,
        author,
        isPublished,
        tags,
      });

      await this.articleRepo.save(newArticle);

      return newArticle;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else if (error.code == 23505) {
        throw new BadRequestException('Article slug and title already exists.');
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(queries: { limit: number; page: number; category: number }) {
    try {
      let { limit, page, category } = queries;
      isNaN(page) && (page = 1);
      isNaN(limit) && (limit = 10);

      let result = [];
      if (!isNaN(category) && category > 0) {
        result = await this.articleRepo.find({
          take: limit,
          skip: (page - 1) * limit,
          where: { category: category as any, isPublished: true },
          select: [
            'id',
            'title',
            'slug',
            'description',
            'cover',
            'category',
            'author',
            'createdAt',
          ],
        });
      } else {
        result = await this.articleRepo.find({
          take: limit,
          skip: (page - 1) * limit,
          where: { isPublished: true },
          select: [
            'id',
            'title',
            'slug',
            'description',
            'cover',
            'category',
            'author',
            'createdAt',
          ],
        });
      }

      return result;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      if (!id && id <= 0) {
        throw new NotFoundException('article not found.');
      }

      const article = await this.articleRepo.findOne({
        where: { id, isPublished: true },
      });
      if (!article) {
        throw new NotFoundException('article not found.');
      }

      return article;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(
    id: number,
    updateArticleDto: UpdateArticleDto,
    file: Express.Multer.File,
    req: any,
  ) {
    try {
      if (!id && id <= 0) {
        throw new NotFoundException('article not found.');
      }

      const { title, description, content, category } = updateArticleDto;
      // check category exists
      if (isNaN(category)) {
        throw new NotFoundException('category not found.');
      }
      const checkCategory = await this.categoryRepo.findOne({
        where: { id: category },
      });
      if (!checkCategory) {
        throw new NotFoundException('category not found.');
      }
      // check article exists
      const article = await this.articleRepo.findOne({ where: { id } });
      if (!article) {
        console.log(article);
        throw new NotFoundException('article not found.');
      }

      // updating results as update dto
      let tagIds = updateArticleDto.tags as any;
      tagIds = JSON.parse(tagIds) as number[];
      tagIds = tagIds.map((item: number) => !isNaN(item) && +item);
      const tags = await this.tagRepo.find({ where: { id: In(tagIds) } });

      let isPublished = updateArticleDto.isPublished === '1';

      const slug = title.replaceAll(/ |_/g, '-').toLowerCase();
      const author = req.user;

      let filePath: string | null = null;
      if (file && file.filename) filePath = file.filename;

      article.title = title;
      article.slug = slug;
      article.description = description;
      article.cover = filePath;
      article.content = content;
      article.category = checkCategory;
      article.author = author;
      article.isPublished = isPublished;
      article.tags = tags;

      const result = await this.articleRepo.save(article);

      return result;
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
        throw new NotFoundException('article not found.');
      }

      const result = await this.articleRepo.delete(id);
      if (!result.affected) {
        throw new NotFoundException('article not found.');
      }

      return { message: 'article removed.' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
