import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'

import { UpdateUserInput } from './dto/';
import { User } from './entities/user.entity';
import { SingupInput } from '../auth/dto/inputs/singup.input';
import { ValidRoles } from '../auth/enums/valid-roles.enums';

@Injectable()
export class UsersService {
	private logger = new Logger('UsersServices')

	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>
	) {}

  async create(singupInptut: SingupInput): Promise<User> {
		try {
			const user = await this.userRepository.create({
				...singupInptut,
				password: bcrypt.hashSync(singupInptut.password, 10)
			})

			return await this.userRepository.save(user);

		} catch (error) {
			this.handleDBErrors(error);
			throw new InternalServerErrorException(`Something was wrong`);
		}
  }

  async findAll(roles: ValidRoles[]): Promise<User[]> {
		if(roles.length === 0)
    	return this.userRepository.find({ 
				relations: { lastUpdateBy: true } 
			})

		return this.userRepository
						.createQueryBuilder()
						.andWhere('ARRAY[roles] && ARRAY[:...roles]')
						.setParameter('roles', roles)
						.getMany()
  }

	async findOne(id: string): Promise<User> {
		try {
			return await this.userRepository.findOneByOrFail({ id });
		} catch (error) {
			throw new NotFoundException(`User with ID "${id}" not found`)
		}
	}

  async findOneByEmail(email: string): Promise<User> {
		try {
			const user = await this.userRepository.findOneByOrFail({ email })
			return user
			
		} catch (error) {
			this.handleDBErrors({
				code: 'BE-001',
				detail: `${ email } no found`
			})
		}
  }

  async findOneById(userId: string): Promise<User> {
		try {
			const user = await this.userRepository.findOneByOrFail({ id: userId })
			return user
			
		} catch (error) {
			this.handleDBErrors({
				code: 'BE-001',
				detail: `${ userId } no found`
			})
		}
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  async block(id: string, user: User): Promise<User> {
		const userToBlock = await this.findOne(id);

		userToBlock.isActive = false
		userToBlock.lastUpdateBy = user

		return this.userRepository.save(userToBlock)
  }

	private handleDBErrors(error: any): never {
		if(error?.code === '23505') {
			throw new BadRequestException(error.detail.replace('Key ', ''));
		}

		if(error?.code === 'BE-001') {
			throw new BadRequestException(error.detail);
		}
		
		this.logger.error(error);

		throw new BadRequestException(`Please check server logs`);
	}
}
