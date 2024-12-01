import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { PokemonModule } from './pokemon/pokemon.module';
import { UserPokemonModule } from './user-pokemon/user-pokemon.module';

@Module({
  imports: [
    AuthModule, 
    PokemonModule,
    UserPokemonModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'pikachu',
      password: 'pikachu',
      database: 'pokemon',
      logging: true,
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
