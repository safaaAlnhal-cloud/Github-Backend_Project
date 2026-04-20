import {Entity, PrimaryGeneratedColumn, Column,CreateDateColumn,} from 'typeorm';

@Entity()
export class SearchHistory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  username!: string;

  @Column()
  github_id!: number;

  @CreateDateColumn()
  searched_at!: Date;
}