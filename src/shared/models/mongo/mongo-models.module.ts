import { AccessKey, AccessKeySchema } from 'src/shared/schemas/mongo/access-key.schema';
import { Global, Module } from '@nestjs/common';

import { AccessKeyMongoService } from './access-key/access-key.service';
import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      // Import all the schemas here
      {
        name: AccessKey.name,
        schema: AccessKeySchema,
        collection: 'access_keys'
      }
    ])
  ],
  providers: [AccessKeyMongoService],
  exports: [AccessKeyMongoService]
})
export class MongoModelsModule { }
