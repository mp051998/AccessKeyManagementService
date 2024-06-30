import { Test, TestingModule } from '@nestjs/testing';
import { UserAccessKeysService } from './user-access-keys.service';

describe('UserAccessKeysService', () => {
  let service: UserAccessKeysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserAccessKeysService],
    }).compile();

    service = module.get<UserAccessKeysService>(UserAccessKeysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
