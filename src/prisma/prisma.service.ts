import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Db, MongoClient } from 'mongodb';

@Injectable()
export class PrismaService {
  mongodb!: Db;
  client = new PrismaClient();
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    this.init();
  }

  async init() {
    const mongoOptions = { maxPoolSize: 50, wtimeoutMS: 2500 };
    const mongoClient = new MongoClient(
      process.env['DATABASE_URL'] || '',
      mongoOptions,
    );
    const connection = await mongoClient.connect();
    this.mongodb = connection.db();

    this.logger.debug(
      `conexión db consultorio run on: http://localhost:${3006}/graphql `,
    );
  }

  async onModuleDestroy() {
    await this.init();
  }
}
