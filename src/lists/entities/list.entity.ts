import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ListItem } from '../../list-item/entities/list-item.entity';

@ObjectType()
@Entity({ name: 'lists' })
export class List {

	@Field( () => ID )
	@PrimaryGeneratedColumn('uuid')
	id: string;
	
	@Field( () => String, { nullable: false } )
	@Column()
	name: string;
	
	@Field( () => User, { nullable: false } )
	@ManyToOne( () => User, (user) => user.lists, { nullable: false } )
	@Index('user-id-list-index')
	user: User;

	@Field( () => [ListItem] )
	@OneToMany( () => ListItem, (listItem) => listItem.list, { lazy: true } )
	listItem: ListItem
}
