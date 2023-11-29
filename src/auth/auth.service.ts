import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { AuthResponse } from './types';
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

	private getJwtToken(userId): string {
		return this.jwtService.sign({ id: userId })
	}
}
