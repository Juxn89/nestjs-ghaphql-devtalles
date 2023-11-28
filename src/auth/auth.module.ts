import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from '../users/users.module';

@Module({
  providers: [AuthResolver, AuthService],
	imports: [
		ConfigModule,
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.registerAsync({
			imports: [ ConfigModule ],
			inject: [ ConfigService ],
			useFactory: (configService: ConfigService) => ({
					secret: configService.get('JWT_SECRET'),
					signOptions: {
						expiresIn: '4h'
					}
			})
		}),
		UsersModule,
	]
})
export class AuthModule {}
