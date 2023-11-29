import { ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";

export class JwtAuthGuards extends AuthGuard('jwt') {
	getRequest(context: ExecutionContext) {
		const graphqlContext = GqlExecutionContext.create(context)
		const request = graphqlContext.getContext().req

		return request;
	}
}