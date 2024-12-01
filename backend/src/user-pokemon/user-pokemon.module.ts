import { Module } from '@nestjs/common';
import { UserPokemonService } from './user-pokemon.service';
import { UserPokemonController } from './user-pokemon.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPokemon } from './user-pokemon.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserPokemon])],
  providers: [UserPokemonService],
  controllers: [UserPokemonController],
  exports: [UserPokemonService],
})
export class UserPokemonModule {}
