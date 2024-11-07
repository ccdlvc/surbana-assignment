// location.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Unique,
} from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
import { Building } from './building.entity';

@Entity({ name: 'tb_location' })
@Unique(['locationNumber'])
export class Location {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @IsNotEmpty()
  @IsString()
  @Column({ name: 'name', type: 'varchar', nullable: false })
  name: string;

  @IsNotEmpty()
  @IsString()
  @Column({ name: 'location_number', type: 'varchar', nullable: false })
  locationNumber: string;

  @Column('float', { name: 'area', nullable: false })
  area: number;

  @ManyToOne(() => Location, (location) => location.children)
  @JoinColumn({ name: 'parent_id' })
  parent: Location;
  @Column({ name: 'parent_id', type: 'int', nullable: true }) parentId: number;

  @OneToMany(() => Location, (location) => location.parent)
  children: Location[];

  @ManyToOne(() => Building, (building) => building.locations)
  @JoinColumn({ name: 'building_id' })
  building: Building;

  @IsNotEmpty()
  @Column({ name: 'building_id', type: 'int', nullable: false })
  buildingId: number;
}
