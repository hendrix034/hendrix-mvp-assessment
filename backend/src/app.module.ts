import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LocationsModule } from './locations/locations.module';
import { User } from './users/user.entity';
import { Location } from './locations/location.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 3307),
      username: process.env.DB_USER || 'assessment',
      password: process.env.DB_PASSWORD || 'assessment',
      database: process.env.DB_NAME || 'assessment',
      entities: [User, Location],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Location]),
    AuthModule,
    UsersModule,
    LocationsModule,
  ],
  providers: [SeedService],
})
export class AppModule {}
