import { Test, TestingModule } from '@nestjs/testing';
import { CollaboratorController } from './collaborator.controller';
import { CollaboratorService } from './collaborator.service';

describe('CollaboratorController', () => {
  let collaboratorController: CollaboratorController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CollaboratorController],
      providers: [CollaboratorService],
    }).compile();

    collaboratorController = app.get<CollaboratorController>(CollaboratorController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect('2').toBe('2!');
    });
  });
});
