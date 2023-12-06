import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

@InputType()
export class CreateItemInput {
  
	@Field( () => String )
	@IsNotEmpty()
	@IsString()
	name: string;
	
	@Field( () => Float )
	@IsPositive()
	@IsOptional()
	quantity?: number = 1;
	
	@Field( () => String, { nullable: true } )
	@IsString()
	@IsOptional()
	quantityUnit?: string;
}
