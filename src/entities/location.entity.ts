// location.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';

@Entity({ name: 'tb_location' })
export class Location {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @IsNotEmpty()
  @IsString()
  @Column({ name: 'name', nullable: false })
  name: string;

  @IsNotEmpty()
  @IsString()
  @Column({ name: 'location_number', nullable: false })
  locationNumber: string;

  @Column('float', { name: 'area', nullable: false })
  area: number;

  @ManyToOne(() => Location, (location) => location.children)
  @JoinColumn({ name: 'parent_id' })
  parent: Location;
  @Column({ name: 'parent_id', nullable: true }) parentId: number;

  @OneToMany(() => Location, (location) => location.parent)
  children: Location[];
}
