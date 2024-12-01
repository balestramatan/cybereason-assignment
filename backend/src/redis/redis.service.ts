import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;

  async onModuleInit() {
    this.client = createClient({
      url: 'redis://redis:6379',
    });

    this.client.on('error', (err) => console.error('Redis Client Error', err));

    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.disconnect();
  }

  async get(key: string): Promise<any | null> {
    const result = await this.client.get(key);
    console.log(`Redis GET for key "${key}":`, result);

    if (result) {
      return JSON.parse(result);
    } else {
      return null;
    }
  }

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    await this.client.set(key, JSON.stringify(value), { EX: ttl });
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  async flushAll(): Promise<void> {
    await this.client.flushAll();
  }

  async keys(pattern: string): Promise<string[]> {
    return this.client.keys(pattern);
  }
}
