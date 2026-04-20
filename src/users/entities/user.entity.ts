import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  github_id!: number;

  @Column()
  username!: string;

  @Column({ nullable: true })
  name!: string;

  @Column()
  avatar_url!: string;

  @Column({ nullable: true })
  bio!: string;

  @Column()
  public_repos!: number;

  @Column()
  followers!: number;

  @Column()
  following!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}