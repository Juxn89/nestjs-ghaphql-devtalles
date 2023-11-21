import { Float, Int, Query, Resolver } from '@nestjs/graphql';

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

    @Query( () => Int, { name: 'RandomNumberFromZeroTo' } )
    getRandoFromZeroTo(): number {
        return Math.floor(Math.random() * 10)
    }
}
