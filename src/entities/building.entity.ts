import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Unique,
} from 'typeorm';
import { Location } from './location.entity';
import { IsNotEmpty, IsString } from 'class-validator';

@Entity({ name: 'tb_building' })
@Unique(['name'])
export class Building {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @IsString()
  @Column({ name: 'name', type: 'varchar', nullable: false })
  name: string;

  @OneToMany(() => Location, (location) => location.building)
  locations: Location[];
}
