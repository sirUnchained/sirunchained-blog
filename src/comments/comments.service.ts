import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { ArticleEntity } from 'src/articles/entities/article.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepo: Repository<CommentEntity>,
    @InjectRepository(ArticleEntity)
    private readonly articleRepo: Repository<ArticleEntity>,
  ) {}

  async create(createCommentDto: CreateCommentDto, req: any) {
    try {
      const { content, article } = createCommentDto;
      const user = req.user;
      let parent: any = createCommentDto.parent;

      const checkArticle = await this.articleRepo.findOneBy({ id: article });
      if (!checkArticle) {
        throw new NotFoundException('article not found.');
      }

      if (parent) {
        parent = await this.commentRepo.findOneBy({ id: parent });
        if (!parent) {
          throw new NotFoundException('could not find comment parent.');
        }
      } else {
        parent = null;
      }

      const comment = this.commentRepo.create({
        content,
        user,
        parent,
        article: checkArticle,
      });
      await this.commentRepo.save(comment);

      return comment;
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAllArticlesComments(queries: { limit: number; page: number }) {
    try {
      let { limit, page } = queries;
      isNaN(page) && (page = 1);
      isNaN(limit) && (limit = 10);

      const comments = await this.commentRepo.find({
        take: limit,
        skip: (page - 1) * limit,
      });

      return comments;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOneArticleComments(
    queries: { limit: number; page: number },
    id: number,
  ) {
    try {
      if (!id || id <= 0) {
        throw new NotFoundException('article not found.');
      }

      let { limit, page } = queries;
      isNaN(page) && (page = 1);
      isNaN(limit) && (limit = 10);

      const comments = await this.commentRepo.find({
        where: {
          article: id as any,
          accepted: true,
        },

        take: limit,
        skip: (page - 1) * limit,
      });

      return comments;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    try {
      if (!id || id <= 0) {
        throw new NotFoundException('article not found.');
      }

      const comment = await this.commentRepo.findOneBy({ id });
      if (!comment) {
        throw new NotFoundException('comment not found.');
      }

      const { content } = updateCommentDto;
      comment.content = content;
      await this.commentRepo.save(comment);

      return comment;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async acceptComment(id: number) {
    try {
      if (!id || id <= 0) {
        throw new NotFoundException('article not found.');
      }

      const result = await this.commentRepo.update({ id }, { accepted: true });
      if (!result.affected) {
        throw new NotFoundException('comment not found.');
      }

      return { message: 'comment accepted.' };
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
        throw new NotFoundException('article not found.');
      }

      const result = await this.commentRepo.delete({ id });
      if (!result.affected) {
        throw new NotFoundException('comment not found.');
      }

      return { message: 'comment removed.' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
