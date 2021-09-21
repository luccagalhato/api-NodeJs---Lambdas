import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';

describe('SearchService', () => {
  let provider: SearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchService],
    }).compile();

    provider = module.get<SearchService>(SearchService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
