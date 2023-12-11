import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateListItemInput, UpdateListItemInput } from './dto/';
import { ListItem } from './entities/list-item.entity';
import { List } from 'src/lists/entities/list.entity';
import { PaginationArgs, SearchArgs } from '../common/dto/args/';

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

  async findAll(list: List, paginationArgs: PaginationArgs, searchArgs: SearchArgs): Promise<ListItem[]> {
		const { limit, offset } = paginationArgs
		const { search } = searchArgs

		const queryBuilder = this.listItemRepository.createQueryBuilder('listItem')
			.innerJoin('listItem.item', 'item')
			.take(limit)
			.skip(offset)
			.where(`"listId" = :listId`, { listId: list.id })

		if(search) {
			queryBuilder.andWhere('LOWER(item.name) like :name', { name: `%${search.toLowerCase()}%` })
		}

		return queryBuilder.getMany();
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

	async getTotalListItemByList(list: List): Promise<number> {
		const total = await this.listItemRepository.count({
			where: {
				list: {
					id: list.id
				}
			}
		})

		return total;
	}
}
