import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'

import { UpdateUserInput } from './dto/';
import { User } from './entities/user.entity';
import { SingupInput } from '../auth/dto/inputs/singup.input';

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

  async findAll(): Promise<User[]> {
    return [];
  }

	async findOne(id: string): Promise<User> {
		throw new Error(`findOne method not implemented yet`)
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

  async block(id: string): Promise<User> {
    throw new Error(`block method not implemented yet`);
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
