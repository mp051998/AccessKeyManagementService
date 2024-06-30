import { Injectable, NotFoundException } from '@nestjs/common';

import { AccessKeyMongoService } from 'src/shared/models/mongo/access-key/access-key.service';

@Injectable()
export class UserAccessKeysService {

  private accessKeyMongoSvc: AccessKeyMongoService;

  constructor(
    accessKeyMongoSvc: AccessKeyMongoService
  ) {
    this.accessKeyMongoSvc = accessKeyMongoSvc;
  }

  async getKey(key: string) {
    const accessKeyData = await this.accessKeyMongoSvc.getAccessKey(key);
    if (!accessKeyData) {
      throw new NotFoundException('Access key not found');
    }
    return accessKeyData;
  }
}
