import { Test, TestingModule } from '@nestjs/testing';
import { PokemonController } from './pokemon.controller';
import { PokemonService } from './pokemon.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('PokemonController', () => {
  let controller: PokemonController;
  let service: PokemonService;

  const mockPokemonService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    toggleFavorite: jest.fn(),
    updateNickname: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PokemonController],
      providers: [
        {
          provide: PokemonService,
          useValue: mockPokemonService,
        },
      ],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue({ canActivate: jest.fn(() => true) })
    .compile();

    controller = module.get<PokemonController>(PokemonController);
    service = module.get<PokemonService>(PokemonService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call findAll with correct parameters', async () => {
      const req = { user: { id: 1 } };
      const query = { limit: 20, offset: 0, name: '', type: '' };
      await controller.findAll(query.limit, query.offset, query.name, query.type, req);
      expect(service.findAll).toHaveBeenCalledWith(1, 20, 0, '', '');
    });
  });

  describe('findOne', () => {
    it('should call findOne with correct parameters', async () => {
      const req = { user: { id: 1 } };
      const id = 1;
      await controller.findOne(req, id);
      expect(service.findOne).toHaveBeenCalledWith(1, id);
    });
  });

  describe('favoritePokemon', () => {
    it('should call toggleFavorite with correct parameters', async () => {
      const req = { user: { id: 1 } };
      const pokemonId = 1;
      const isFavorite = true;
      await controller.favoritePokemon(req, pokemonId, isFavorite);
      expect(service.toggleFavorite).toHaveBeenCalledWith(1, pokemonId, isFavorite);
    });
  });

  describe('updateNickname', () => {
    it('should call updateNickname with correct parameters', async () => {
      const req = { user: { id: 1 } };
      const pokemonId = 1;
      const nickname = 'Pikachu';
      await controller.updateNickname(pokemonId, nickname, req);
      expect(service.updateNickname).toHaveBeenCalledWith(1, pokemonId, nickname);
    });
  });

  describe('deletePokemon', () => {
    it('should call delete with correct parameters', async () => {
      const id = 1;
      await controller.deletePokemon(id);
      expect(service.delete).toHaveBeenCalledWith(id);
    });
  });
});