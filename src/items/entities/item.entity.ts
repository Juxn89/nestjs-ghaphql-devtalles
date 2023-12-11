import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ListItem } from '../../list-item/entities/list-item.entity';

@ObjectType()
@Entity({ name: 'items' })
export class Item {

  @Field(() => ID)
	@PrimaryGeneratedColumn('uuid')
  id: string;

	@Field( () => String )
	@Column()
	name: string;
	
	@Field( () => Float )
	@Column()
	quantity: number;
	
	@Field( () => String, { nullable: true } )
	@Column({ nullable: true })
	quantityUnit?: string;

	@ManyToOne( () => User, (user) => user.items, { nullable: false, eager: true } )
	@Index('userID-index')
	@Field( () => User )
	user: User;

	@OneToMany( () => ListItem, (listItem) => listItem.item, { lazy: true } )
	listItem: ListItem
}
