import { Test, TestingModule } from '@nestjs/testing';
import { CabinController } from './cabin.controller';

describe('CabinController', () => {
  let controller: CabinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CabinController],
    }).compile();

    controller = module.get<CabinController>(CabinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
