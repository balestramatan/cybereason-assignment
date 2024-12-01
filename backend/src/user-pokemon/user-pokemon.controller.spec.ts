import { Test, TestingModule } from '@nestjs/testing';
import { UserPokemonController } from './user-pokemon.controller';

describe('UserPokemonController', () => {
  let controller: UserPokemonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserPokemonController],
    }).compile();

    controller = module.get<UserPokemonController>(UserPokemonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
