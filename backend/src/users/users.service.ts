import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private users: Repository<User>) {}

  findByEmail(email: string) { return this.users.findOneBy({ email }); }
  findById(id: number) { return this.users.findOneBy({ id }); }
  findInspectors() { return this.users.find({ where: { role: UserRole.Inspector }, select: ['id', 'email', 'name', 'role'] }); }
}
