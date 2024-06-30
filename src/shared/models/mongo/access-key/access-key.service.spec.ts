import { Test, TestingModule } from '@nestjs/testing';

import { AccessKeyMongoService } from './access-key.service';
import mockAccessKeyMongoService from 'src/tests/mocks/mongo/access-key-mongo-service.mock';

describe('AccessKeyService', () => {
  let service: AccessKeyMongoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: AccessKeyMongoService, useValue: mockAccessKeyMongoService },
      ],
    }).compile();

    service = module.get<AccessKeyMongoService>(AccessKeyMongoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
