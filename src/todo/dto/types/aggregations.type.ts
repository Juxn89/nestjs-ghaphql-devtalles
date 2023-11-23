import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: 'ToDo quick aggregations' })
export class AggregationsType {

	@Field( () => Int )
	total: number;

	@Field( () => Int )
	pending: number;

	@Field( () => Int )
	completed: number

	@Field( () => Int, { deprecationReason: 'Must use completed instead' } )
	totalCompleted: number
}