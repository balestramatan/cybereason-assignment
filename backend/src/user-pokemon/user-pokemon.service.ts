import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPokemon } from './user-pokemon.entity';

@Injectable()
export class UserPokemonService {
  constructor(
    @InjectRepository(UserPokemon)
    private readonly userPokemonRepository: Repository<UserPokemon>
  ) {}
}
