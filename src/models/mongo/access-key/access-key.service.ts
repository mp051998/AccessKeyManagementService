import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccessKey, AccessKeyDocument } from 'src/schemas/mongo/access-key.schema';

@Injectable()
export class AccessKeyService {
  constructor(@InjectModel(AccessKey.name) private accessKeyModel: Model<AccessKeyDocument>) { }

  // Create a new access key
  async createAccessKey(key: string, rateLimitPerMin: number, expireAt: Date): Promise<AccessKeyDocument> {
    const accessKey = new this.accessKeyModel({ key, rateLimitPerMin, expireAt });
    return await accessKey.save();
  }

  // Get an access key by key
  async getAccessKeyByKey(key: string): Promise<AccessKeyDocument> {
    return await this.accessKeyModel.findOne({ key });
  }

  // Get all access keys
  async getAllAccessKeys(): Promise<AccessKeyDocument[]> {
    return await this.accessKeyModel.find();
  }

  // Get all active access keys
  async getAllActiveAccessKeys(): Promise<AccessKeyDocument[]> {
    return await this.accessKeyModel.find({ expireAt: { $gt: new Date() } });
  }
}