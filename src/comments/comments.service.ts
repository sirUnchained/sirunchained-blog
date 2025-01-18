import {
  BadRequestException,
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
        where: {
          accepted: false,
        },
        relations: {
          parent: true,
          user: true,
        },

        take: limit,
        skip: (page - 1) * limit,
      });

      // dont show replies which their parrents are accepted, and dont show users passwords
      for (let i = 0; i < comments.length; i++) {
        if (!comments[i].parent.accepted) {
          comments.splice(i, 1);
        } else {
          delete comments[i].user.password;
        }
      }

      return { comments, count: comments.length };
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
          parent: null,
        },
        relations: {
          user: true,
        },

        take: limit,
        skip: (page - 1) * limit,
      });

      // dont show users password, email and phone
      for (let i = 0; i < comments.length; i++) {
        delete comments[i].user.password;
        delete comments[i].user.email;
        delete comments[i].user.phone;
        delete comments[i].user.isBanned;
      }

      return { comments, count: comments.length };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async getCommentReplies(
    queries: { limit: number; page: number },
    id: number,
  ) {
    try {
      if (!id || id <= 0) {
        throw new NotFoundException('comment not found.');
      }

      let { limit, page } = queries;
      isNaN(page) && (page = 1);
      isNaN(limit) && (limit = 10);

      const comment = await this.commentRepo.findOne({
        where: { id, accepted: true },
        relations: { parent: true },
      });
      if (!comment) {
        throw new NotFoundException('could not find comment.');
      } else if (comment.parent != null) {
        throw new BadRequestException(
          'this comment is not a parrent comment !',
        );
      }

      console.log(comment.id);
      const replies = await this.commentRepo.find({
        where: { parent: { id: comment.id }, accepted: true },
        relations: { user: true, parent: true },
        take: limit,
        skip: (page - 1) * limit,
      });
      console.log(replies);

      // dont show users passwords, email and phone
      for (let i = 0; i < replies.length; i++) {
        delete replies[i].user.password;
        delete replies[i].user.email;
        delete replies[i].user.phone;
        delete replies[i].user.isBanned;
      }

      return { replies, count: replies.length };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, updateCommentDto: UpdateCommentDto, req: any) {
    try {
      if (!id || id <= 0) {
        throw new NotFoundException('article not found.');
      }

      const comment = await this.commentRepo.findOne({
        relations: { user: true },
        where: { id },
      });
      if (!comment) {
        throw new NotFoundException('comment not found.');
      }

      const user = req.user;
      if (comment.user.id != user.id) {
        throw new BadRequestException(
          "you don't have permission to update this comment.",
        );
      }

      const { content } = updateCommentDto;
      comment.content = content;
      await this.commentRepo.save(comment);

      return comment;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else if (error instanceof BadRequestException) {
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

      const comment = await this.commentRepo.findOne({
        relations: { parent: true },
        where: { id },
      });
      if (!comment) {
        throw new NotFoundException('comment not found.');
      }

      if (comment.parent == null) {
        await this.commentRepo.delete({ parent: { id: comment.id } });
      }

      await this.commentRepo.delete({ id: comment.id });

      return { message: 'comment removed.' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
