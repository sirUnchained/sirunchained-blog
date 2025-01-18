import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  Put,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @Req() req: any) {
    return this.commentsService.create(createCommentDto, req);
  }

  @Get()
  findAllArticlesComments(@Query() queries: { limit: number; page: number }) {
    return this.commentsService.findAllArticlesComments(queries);
  }

  @Get(':id')
  findOneArticleComments(
    @Query() queries: { limit: number; page: number },
    @Param('id') id: string,
  ) {
    return this.commentsService.findOneArticleComments(queries, +id);
  }

  @Get('reply/:id')
  getCommentReplies(
    @Query() queries: { limit: number; page: number },
    @Param('id') id: string,
  ) {
    return this.commentsService.getCommentReplies(queries, +id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req: any,
  ) {
    return this.commentsService.update(+id, updateCommentDto, req);
  }

  @Patch(':id')
  acceptComment(@Param('id') id: string) {
    return this.commentsService.acceptComment(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id);
  }
}
