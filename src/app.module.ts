import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { ItemsModule } from './items/items.module';
import { ListItemModule } from './list-item/list-item.module';
import { ListsModule } from './lists/lists.module';
import { SeedModule } from './seed/seed.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
		ConfigModule.forRoot(),
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			playground: false,
			autoSchemaFile: join(process.cwd(), 'src/schema.gpl'),
			plugins: [
				ApolloServerPluginLandingPageLocalDefault()
			]
		}),
		TypeOrmModule.forRoot({
			type: 'postgres',
			ssl: (process.env.STATE === 'prod') 
				? { rejectUnauthorized: false, sslmode: 'require' } 
				: false as any,
			host: process.env.DB_HOST,
			port: +process.env.DB_PORT,
			username: process.env.DB_USERNAME,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
			entities: [],
			synchronize: true,
			autoLoadEntities: true
		}),
		ItemsModule,
		UsersModule,
		AuthModule,
		SeedModule,
		CommonModule,
		ListsModule,
		ListItemModule
	],
  controllers: [],
  providers: [],
})
export class AppModule {
	constructor() {
		console.log({
			host: process.env.DB_HOST,
			port: +process.env.DB_PORT,
			username: process.env.DB_USERNAME,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
		});
	}
}
