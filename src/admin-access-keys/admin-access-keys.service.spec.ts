import { Test, TestingModule } from '@nestjs/testing';

import { AdminAccessKeysService } from './admin-access-keys.service';

// TODO: Add tests
describe('AccessKeyManagementService', () => {
  let service: AdminAccessKeysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminAccessKeysService],
    }).compile();

    service = module.get<AdminAccessKeysService>(AdminAccessKeysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
