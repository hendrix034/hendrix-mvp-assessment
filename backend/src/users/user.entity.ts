import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  Manager = 'Manager',
  Inspector = 'Inspector',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column()
  passwordHash: string;
}
