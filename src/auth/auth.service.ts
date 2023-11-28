import { Injectable } from '@nestjs/common';

import { AuthResponse } from './types';
import { SingupInput } from './dto/inputs';
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
}
