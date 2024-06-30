import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccessKey, AccessKeyDocument } from 'src/shared/schemas/mongo/access-key.schema';

@Injectable()
export class AccessKeyMongoService {
  constructor(@InjectModel(AccessKey.name) private accessKeyModel: Model<AccessKeyDocument>) { }

  // Create a new access key
  async createAccessKey(key: string, rateLimitPerMin: number, expireAt: Date): Promise<AccessKeyDocument> {
    const accessKey = new this.accessKeyModel({ key, rateLimitPerMin, expireAt });
    return await accessKey.save();
  }

  // Get an access key
  async getAccessKey(key: string): Promise<AccessKeyDocument> {
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

  // Update access key
  async updateAccessKey(key: string, rateLimitPerMin: number, expireAt: Date): Promise<AccessKeyDocument> {
    // To ensure the document is updated properly and the updated document is returned, you should set the new option to true
    // useFindAndModify to false is recommended to use MongoDB's findOneAndUpdate() function behind the scenes, which provides better performance and more accurate results.
    return await this.accessKeyModel.findOneAndUpdate(
      { key },
      { rateLimitPerMin, expireAt },
      { new: true, useFindAndModify: false }
    );
  }

  // Delete an access key
  // NOTE: I'm performing a soft delete here by setting the expireAt field to the current date
  // This way we have a record of all the keys, we can have it restored if needed and it's easier for 
  // redis pubsub to to handle as well.
  async deleteAccessKey(key: string): Promise<AccessKeyDocument> {
    // return await this.accessKeyModel.findOneAndDelete({ key });
    const accessKeyData = await this.accessKeyModel.findOne({ key });
    accessKeyData.expireAt = new Date();
    await accessKeyData.save();
    return accessKeyData;
  }
}