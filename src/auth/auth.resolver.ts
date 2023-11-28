import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AuthResponse } from './types';
import { LoginInput, SingupInput } from './dto/inputs';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

	@Mutation ( () => AuthResponse, { name: 'singup' })
	async singup(
		@Args('singupInput') singupInput: SingupInput
	): Promise<AuthResponse> {
		return this.authService.singup(singupInput)
	}

	@Mutation( () => AuthResponse, { name: 'login' })
	async login(
		@Args('loginInput') loginInput: LoginInput
	): Promise<AuthResponse> {
		return this.authService.login(loginInput)
	}
}
