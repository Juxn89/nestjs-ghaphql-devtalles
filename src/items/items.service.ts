import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Item } from './entities/item.entity';
import { CreateItemInput, UpdateItemInput } from './dto/inputs/';

@Injectable()
export class ItemsService {

	constructor(
		@InjectRepository(Item)
		private readonly itemsRepository: Repository<Item>
	) {}

  async create(createItemInput: CreateItemInput): Promise<Item> {
		const item = this.itemsRepository.create(createItemInput);

		await this.itemsRepository.save(item);
		
    return item
  }

  async findAll(): Promise<Item[]> {
		const items = await this.itemsRepository.find();
    return items;
  }

  async findOne(id: string): Promise<Item> {
		const item = await this.itemsRepository.findOneBy({ id })

		if(!item)
			throw new NotFoundException(`Item with ID "${ id }" not found`);

    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput): Promise<Item> {
		const item = await this.itemsRepository.preload(updateItemInput);

		return await this.itemsRepository.save(item);
  }

  async remove(id: string): Promise<Item> {
		const item = await this.findOne(id)

		await this.itemsRepository.remove(item)

    return { ...item, id };
  }
}
