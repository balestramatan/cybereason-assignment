import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'pokemons' })
export class Pokemon {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  image?: string; // Image is optional
}