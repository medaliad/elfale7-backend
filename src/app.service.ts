import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getWelcome(): { message: string; apiDocs: string } {
    return {
      message: 'Welcome to the Farm Management API',
      apiDocs: '/api/docs',
    };
  }
}
