import { IsArray } from 'class-validator';
import { ValidRoles } from '../../../auth/enums/valid-roles.enums';
import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class ValidRolesArgs {

	@IsArray()
	@Field( () => [ValidRoles], { nullable: true } )
	roles: ValidRoles[] = []
}