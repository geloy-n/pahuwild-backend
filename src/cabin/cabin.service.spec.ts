import { Test, TestingModule } from '@nestjs/testing';
import { CabinService } from './cabin.service';

describe('CabinService', () => {
  let service: CabinService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CabinService],
    }).compile();

    service = module.get<CabinService>(CabinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
