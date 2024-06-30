import * as request from 'supertest';

import { Test, TestingModule } from '@nestjs/testing';

import { AccessKeyMongoService } from 'src/shared/models/mongo/access-key/access-key.service';
import { AppModule } from './../src/app.module';
import { INestApplication } from '@nestjs/common';
import mockAccessKeyMongoService from 'src/tests/mocks/mongo/access-key-mongo-service.mock';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        { provide: AccessKeyMongoService, useValue: mockAccessKeyMongoService }
      ]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Welcome to the Access Key Management Service!');
  });
});
