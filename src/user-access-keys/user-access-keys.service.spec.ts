import { Test, TestingModule } from '@nestjs/testing';

import { AccessKeyMongoService } from 'src/shared/models/mongo/access-key/access-key.service';
import { UserAccessKeysService } from './user-access-keys.service';
import mockAccessKeyMongoService from 'src/tests/mocks/mongo/access-key-mongo-service.mock';

describe('UserAccessKeysService', () => {
  let service: UserAccessKeysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserAccessKeysService,
        { provide: AccessKeyMongoService, useValue: mockAccessKeyMongoService }
      ],
    }).compile();

    service = module.get<UserAccessKeysService>(UserAccessKeysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
