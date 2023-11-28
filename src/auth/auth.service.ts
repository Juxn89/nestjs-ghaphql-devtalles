import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AuthResponse } from './types';
import { LoginInput, SingupInput } from './dto/inputs';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
	
	constructor(
		private readonly usersService: UsersService
	) {}

	async singup(singupInput: SingupInput): Promise<AuthResponse> {
		const user = await this.usersService.create(singupInput);

		const token = 'MY_TOKEN';

		return {
			token,
			user
		}
	}

	async login( loginInput: LoginInput ): Promise<AuthResponse> {
		const { email, password } = loginInput
		const user = await this.usersService.findOneByEmail(email);

		if(!bcrypt.compareSync(password, user.password)) {
			throw new BadRequestException(`User not found`)
		}

		const token = 'MY_TOKEN'

		return {  
			token,
			user
		}
	}
}
