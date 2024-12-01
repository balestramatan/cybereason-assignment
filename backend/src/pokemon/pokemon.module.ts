import { Module } from '@nestjs/common';
import { PokemonController } from './pokemon.controller';
import { PokemonService } from './pokemon.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pokemon } from './pokemon.entity';
import { RedisModule } from 'src/redis/redis.module';
import { UserPokemon } from 'src/user-pokemon/user-pokemon.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pokemon, UserPokemon]), RedisModule],
  controllers: [PokemonController],
  providers: [PokemonService]
})
export class PokemonModule {}
