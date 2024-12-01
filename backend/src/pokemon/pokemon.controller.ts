import { Body, Controller, Delete, Get, Param, Patch, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PokemonService } from './pokemon.service';
import { Pokemon } from './pokemon.entity';

@Controller('pokemon')
@UseGuards(JwtAuthGuard)
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  async findAll(
    @Query('limit') limit: number = 20, 
    @Query('offset') offset: number = 0, 
    @Query('name') name: string = '',
    @Query('type') type: string = '',
    @Request() req) {
    const userId = req.user.id;
    return this.pokemonService.findAll(Number(userId), Number(limit), Number(offset), String(name), String(type));
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: number) {
    const userId = req.user.id;
    return this.pokemonService.findOne(userId, id);
  }

  @Patch(':pokemonId/favorite')
  async favoritePokemon(@Request() req, 
    @Param('pokemonId') pokemonId: number, 
    @Body('isFavorite') isFavorite: boolean) {
      console.log('pokemonId', pokemonId);
      console.log('isFavorite', isFavorite);
      const userId = req.user.id;
      return this.pokemonService.toggleFavorite(userId, pokemonId, isFavorite);
  }

  @Patch(':id/nickname')
  async updateNickname(
    @Param('id') pokemonId: number,
    @Body('nickname') nickname: string,
    @Request() req: any,
  ): Promise<void> {
    const userId = req.user.id;
    await this.pokemonService.updateNickname(userId, pokemonId, nickname);
  }

  @Delete(':id')
  async deletePokemon(@Param('id') id: number) {
    return this.pokemonService.delete(id);
  }
}