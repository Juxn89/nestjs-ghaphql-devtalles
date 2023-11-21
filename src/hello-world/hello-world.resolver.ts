import { Args, Float, Int, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class HelloWorldResolver {
    @Query( () => String, { name: 'ShowSmileFace', description: 'Returns a smile face' } )
    helloWorl(): string {
        return ':)'
    }

    @Query( () => Float, { name: 'RandomNumber' } )
    getRandoNumber(): number {
        return Math.random() * 100;
    }

    @Query( () => Int, { name: 'RandomNumberFromZeroTo', description: 'From zero to argumento TO' } )
    getRandoFromZeroTo(
        @Args('to', { nullable: true, type: () => Int }) to: number = 10
    ): number {
        return Math.floor(Math.random() * to) + 1
    }
}
