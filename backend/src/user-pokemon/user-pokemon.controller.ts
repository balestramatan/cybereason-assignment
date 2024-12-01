import { Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user-pokemon')
@UseGuards(JwtAuthGuard)
export class UserPokemonController {}
