import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateListItemInput, UpdateListItemInput } from './dto/';
import { ListItem } from './entities/list-item.entity';

@Injectable()
export class ListItemService {

	constructor(
		@InjectRepository(ListItem) private readonly listItemRepository: Repository<ListItem>
	){}

  async create(createListItemInput: CreateListItemInput): Promise<ListItem> {
		const { itemId, listId, ...rest } = createListItemInput

		const listItem = this.listItemRepository.create({
			...rest,
			item: { id: itemId },
			list: { id: listId } 
		});

	 	return this.listItemRepository.save(listItem)
  }

  findAll() {
    return `This action returns all listItem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} listItem`;
  }

  update(id: string, updateListItemInput: UpdateListItemInput) {
    return `This action updates a #${id} listItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} listItem`;
  }
}
