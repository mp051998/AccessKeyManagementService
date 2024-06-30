import { Test, TestingModule } from '@nestjs/testing';

import { AccessKeyMongoService } from './access-key.service';

describe('AccessKeyService', () => {
  let service: AccessKeyMongoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccessKeyMongoService],
    }).compile();

    service = module.get<AccessKeyMongoService>(AccessKeyMongoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
