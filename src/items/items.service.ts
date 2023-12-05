import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Item } from './entities/item.entity';
import { CreateItemInput, UpdateItemInput } from './dto/inputs/';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ItemsService {

	constructor(
		@InjectRepository(Item)
		private readonly itemsRepository: Repository<Item>
	) {}

  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
		const item = this.itemsRepository.create({ ...createItemInput, user });

		await this.itemsRepository.save(item);
		
    return item
  }

  async findAll(user: User): Promise<Item[]> {
		const items = await this.itemsRepository.find({
			where: {
				user: { 
					id: user.id
				 }
			}
		});

    return items;
  }

  async findOne(id: string, user: User): Promise<Item> {
		const item = await this.itemsRepository.findOneBy({
			id,
			user: {
				id: user.id
			}
		})

		if(!item)
			throw new NotFoundException(`Item with ID "${ id }" not found`);

    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput, user: User): Promise<Item> {
		await this.findOne(id, user)
		const item = await this.itemsRepository.preload(updateItemInput);

		return await this.itemsRepository.save(item);
  }

  async remove(id: string, user: User): Promise<Item> {
		const item = await this.findOne(id, user)

		await this.itemsRepository.remove(item)

    return { ...item, id };
  }
}
