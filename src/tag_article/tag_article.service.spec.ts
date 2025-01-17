import { Test, TestingModule } from '@nestjs/testing';
import { TagArticleService } from './tag_article.service';

describe('TagArticleService', () => {
  let service: TagArticleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TagArticleService],
    }).compile();

    service = module.get<TagArticleService>(TagArticleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
