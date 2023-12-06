import { Mutation, Resolver } from '@nestjs/graphql';
import { SeedService } from './seed.service';

@Resolver()
export class SeedResolver {
  constructor(private readonly seedService: SeedService) {}

	@Mutation( () => Boolean, { name: 'executeSeed', description: 'Execute database build' } )
	async executeSeed(): Promise<Boolean> {
		return this.seedService.executeSeed()
	}
}
