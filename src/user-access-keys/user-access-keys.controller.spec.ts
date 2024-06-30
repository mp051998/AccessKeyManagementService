import { Test, TestingModule } from '@nestjs/testing';

import { AccessKeyMongoService } from 'src/shared/models/mongo/access-key/access-key.service';
import { UserAccessKeysController } from './user-access-keys.controller';
import { UserAccessKeysService } from './user-access-keys.service';
import mockAccessKeyMongoService from 'src/tests/mocks/mongo/access-key-mongo-service.mock';

describe('UserAccessKeysController', () => {
  let controller: UserAccessKeysController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserAccessKeysController],
      providers: [
        UserAccessKeysService,
        { provide: AccessKeyMongoService, useValue: mockAccessKeyMongoService }
      ]
    }).compile();

    controller = module.get<UserAccessKeysController>(UserAccessKeysController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
