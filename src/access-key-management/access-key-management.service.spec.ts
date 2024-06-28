import { Test, TestingModule } from '@nestjs/testing';

import { AccessKeyManagementService } from './access-key-management.service';

// TODO: Add tests
describe('AccessKeyManagementService', () => {
  let service: AccessKeyManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccessKeyManagementService],
    }).compile();

    service = module.get<AccessKeyManagementService>(AccessKeyManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
