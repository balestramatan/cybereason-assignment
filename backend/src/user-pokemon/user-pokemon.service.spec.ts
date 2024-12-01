import { Test, TestingModule } from '@nestjs/testing';
import { UserPokemonService } from './user-pokemon.service';

describe('UserPokemonService', () => {
  let service: UserPokemonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserPokemonService],
    }).compile();

    service = module.get<UserPokemonService>(UserPokemonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
