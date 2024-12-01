import { Entity, ManyToOne, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';
import { User } from '../auth/user.entity';
import { Pokemon } from '../pokemon/pokemon.entity';

@Entity({ name: 'user_pokemon' })
@Unique(['user', 'pokemon'])
export class UserPokemon {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id, { eager: true })
  user: User;

  @ManyToOne(() => Pokemon, (pokemon) => pokemon.id, { eager: true })
  pokemon: Pokemon;

  @Column({ nullable: true })
  nickname?: string;

  @Column({ default: false })
  isFavorite: boolean;
}
