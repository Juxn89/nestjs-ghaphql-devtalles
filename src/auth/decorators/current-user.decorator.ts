import { ExecutionContext, createParamDecorator, InternalServerErrorException, ForbiddenException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ValidRoles } from '../enums/valid-roles.enums';
import { User } from 'src/users/entities/user.entity';

export const CurrentUser = createParamDecorator(
	(roles: ValidRoles[] = [], context: ExecutionContext) => {
		const graphqlContext = GqlExecutionContext.create(context)
		const user: User = graphqlContext.getContext().req.user

		if(!user)
			throw new InternalServerErrorException(`User missing in request`)
		
		if(roles.length === 0)
			return user

		for (const role of user.roles) {
			if(roles.includes(role as ValidRoles)) {
				return user
			}
		}

		throw new ForbiddenException(`User ${ user.fullName } dosen't have access to this resource`)
	}
)