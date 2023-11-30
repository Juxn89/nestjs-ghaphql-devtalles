import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { AuthResponse } from './types';
import { User } from '../users/entities/user.entity';
import { LoginInput, SingupInput } from './dto/inputs';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
	
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService
	) {}

	async singup(singupInput: SingupInput): Promise<AuthResponse> {
		const user = await this.usersService.create(singupInput);

		const token = this.getJwtToken(user.id)

		return { token, user }
	}

	async login( loginInput: LoginInput ): Promise<AuthResponse> {
		const { email, password } = loginInput
		const user = await this.usersService.findOneByEmail(email);

		if(!bcrypt.compareSync(password, user.password)) {
			throw new BadRequestException(`User not found`)
		}

		const token = this.getJwtToken(user.id)

		return { token, user }
	}

	revalidate(user: User): AuthResponse {
		const { id } = user
		const token = this.getJwtToken(id)

		return { user, token }
	}

	async validateUser(userId: string): Promise<User> {
		const user = await this.usersService.findOneById(userId);

		if(!user.isActive)
			throw new UnauthorizedException(`User is inactive, reach out to admin`)

		delete user.password
		
		return user
	}

	private getJwtToken(userId): string {
		return this.jwtService.sign({ id: userId })
	}
}
