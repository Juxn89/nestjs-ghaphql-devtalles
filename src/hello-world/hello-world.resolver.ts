import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class HelloWorldResolver {
    @Query( () => String )
    helloWorl(): string {
        return ':)'
    }
}
