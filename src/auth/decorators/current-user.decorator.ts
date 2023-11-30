import { ExecutionContext, createParamDecorator, InternalServerErrorException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator( () => {
	(roles = [], context: ExecutionContext) => {
		const graphqlContext = GqlExecutionContext.create(context)
		const user = graphqlContext.getContext().req.user

		if(!user)
			throw new InternalServerErrorException(`User missing in request`)
		
		return user
	}
})