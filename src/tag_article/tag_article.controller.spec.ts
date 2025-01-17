import { Test, TestingModule } from '@nestjs/testing';
import { TagArticleController } from './tag_article.controller';
import { TagArticleService } from './tag_article.service';

describe('TagArticleController', () => {
  let controller: TagArticleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagArticleController],
      providers: [TagArticleService],
    }).compile();

    controller = module.get<TagArticleController>(TagArticleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
