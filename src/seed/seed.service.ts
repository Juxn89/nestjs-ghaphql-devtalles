import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SEED_ITEMS, SEED_LISTS, SEED_USERS } from './data/seed-data';
import { Item } from '../items/entities/item.entity';
import { List } from '../lists/entities/list.entity';
import { User } from '../users/entities/user.entity';
import { ListItem } from '../list-item/entities/list-item.entity';
import { UsersService } from '../users/users.service';
import { ItemsService } from '../items/items.service';
import { ListsService } from '../lists/lists.service';
import { ListItemService } from '../list-item/list-item.service';

@Injectable()
export class SeedService {
	private isProducction: boolean

	constructor(
		private readonly configService: ConfigService,
		@InjectRepository(Item) private readonly itemsRepository: Repository<Item>,
		@InjectRepository(User) private readonly usersRepository: Repository<User>,
		@InjectRepository(List) private readonly listRepository: Repository<List>,
		@InjectRepository(ListItem) private readonly listItemRepository: Repository<ListItem>,
		private readonly usersService: UsersService,
		private readonly itemsService: ItemsService,
		private readonly listService: ListsService,
		private readonly listItemService: ListItemService
	) {
		this.isProducction = configService.get('STATE') === 'prod'
	}
 
	async executeSeed(): Promise<Boolean> {
		if(this.isProducction)
			throw new UnauthorizedException('We cannot run SEED on Prod')

		await this.deleteDatabase()

		const users = await this.loadUsers()

		await this.loadItems(users)

		const lists = await this.loadLists(users)

		await this.loadListItems(lists);
		
		return true
	}

	private async deleteDatabase() {
		await this.listItemRepository.createQueryBuilder()
						.delete()
						.where({})
						.execute()

		await this.listRepository.createQueryBuilder()
						.delete()
						.where({})
						.execute()

		await this.itemsRepository.createQueryBuilder()
						.delete()
						.where({})
						.execute()

		await this.usersRepository.createQueryBuilder()
						.delete()
						.where({})
						.execute()
	}

	private async loadUsers(): Promise<User[]> {
		let users = []

		for (const user of SEED_USERS) {
			users.push( await this.usersService.create(user) )
		}

		return users;
	}

	private async loadItems(users: User[]): Promise<void> {
		const itemsPromises = [];
		for (const item of SEED_ITEMS) {
			const user = this.getRandomValue<User>(users)

			item['quantity'] = Math.floor( Math.random() * 10 );

			itemsPromises.push(this.itemsService.create(item, user))
		}

		await Promise.all(itemsPromises)
	}

	private async loadLists(users: User[]): Promise<List[]> {
		const listPromise: List[] = []
		const user = this.getRandomValue<User>(users)

		for (const list of SEED_LISTS) {
			listPromise.push( await this.listService.create(list, user) )
		}

		return listPromise;
	}

	private async loadListItems(lists: List[]): Promise<void> {
		const list = this.getRandomValue<List>(lists)
		const items: Item[] = await this.itemsService.findAll(list.user, { limit: 15, offset: 0 }, {});

		for (const item of items) {
			await this.listItemService.create({
				quantity: Math.round( Math.random() * 10 ),
				completed: Math.round( Math.random() * 1 ) === 1,
				listId: list.id,
				itemId: item.id
			})
		}
	}

	private getRandomValue<T>(values: T[]): T {
		if(values.length === 0)
			throw new InternalServerErrorException(`List of values couldn't be empty`)

		const randomIndex = Math.floor( Math.random() * values.length )
		const value = values[randomIndex]

		return value
	}
}
