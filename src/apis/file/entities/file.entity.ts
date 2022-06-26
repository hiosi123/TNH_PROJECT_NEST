import { ObjectType } from '@nestjs/graphql';

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 0 })
  number: number;

  @Column({ default: 'url' })
  url: string;
}
