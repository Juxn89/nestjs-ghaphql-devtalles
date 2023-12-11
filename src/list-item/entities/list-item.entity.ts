import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { List } from '../../lists/entities/list.entity';
import { Item } from '../../items/entities/item.entity';

@ObjectType()
@Entity({ name: 'listItems' })
export class ListItem {

	@Field( () => ID )
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Field( () => Number, { nullable: false } )
	@Column( { type: 'numeric' } )
	quantity: number;

	@Field( () => Boolean )
	@Column( { type: 'boolean', default: false } )
	completed: boolean;

	@ManyToOne( () => List, (list) => list.listItem, { lazy: true } )
	list: List;

	@Field( () => Item )
	@ManyToOne( () => Item, (item) => item.listItem, { lazy: true } )
	item: Item;
}
