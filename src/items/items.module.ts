import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ItemsService } from './items.service';
import { Item } from './entities/item.entity';
import { ItemsResolver } from './items.resolver';

@Module({
  providers: [ItemsResolver, ItemsService],
	imports: [
		TypeOrmModule.forFeature([ Item ])
	]
})
export class ItemsModule {}
