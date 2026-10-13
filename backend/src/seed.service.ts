import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { User, UserRole } from './users/user.entity';
import { Location } from './locations/location.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User) private users: Repository<User>,
    @InjectRepository(Location) private locations: Repository<Location>,
  ) {}

  async onApplicationBootstrap() {
    const passwordHash = await bcrypt.hash('password', 10);
    for (const user of [
      { email: 'manager@example.com', name: 'Sarah Jones', role: UserRole.Manager },
      { email: 'inspector@example.com', name: 'Michael Tan', role: UserRole.Inspector },
      { email: 'inspector2@example.com', name: 'Jenny Lim', role: UserRole.Inspector },
    ]) {
      const exists = await this.users.findOneBy({ email: user.email });
      if (!exists) await this.users.save({ ...user, passwordHash });
    }

    for (const name of ['Warehouse A', 'Warehouse B', 'Workshop', 'Loading Dock', 'Maintenance Store']) {
      const exists = await this.locations.findOneBy({ name });
      if (!exists) await this.locations.save({ name });
    }
  }
}
