import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

import { CreateItemInput } from './create-item.input';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

@InputType()
export class UpdateItemInput extends PartialType(CreateItemInput) {

  @Field(() => ID)
	@IsString()
	@IsUUID()
	@IsNotEmpty()
  id: string;
}
