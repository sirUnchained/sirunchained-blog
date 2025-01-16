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
import { Repository } from 'typeorm';
import { CategoryEntity } from 'src/categories/entities/category.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepo: Repository<ArticleEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,
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

  async findAll() {
    return `This action returns all articles`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} article`;
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {
    return `This action updates a #${id} article`;
  }

  async remove(id: number) {
    return `This action removes a #${id} article`;
  }
}
