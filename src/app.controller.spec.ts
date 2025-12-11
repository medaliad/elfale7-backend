import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('root', () => {
    it('should return welcome message and API docs path', () => {
      const result = {
        message: 'Welcome to the Farm Management API',
        apiDocs: '/api/docs',
      };
      jest.spyOn(appService, 'getWelcome').mockImplementation(() => result);
      expect(appController.getWelcome()).toBe(result);
    });
  });
});
