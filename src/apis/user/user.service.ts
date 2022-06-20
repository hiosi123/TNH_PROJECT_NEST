import { ConflictException, Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne({ userid }) {
    return await this.userRepository.findOne({
      where: { userid },
    });
  }

  async create({ createUserInput }) {
    const user = await this.userRepository.findOne({
      where: { userid: createUserInput.userid },
    });

    if (user) throw new ConflictException('이미 등록된 이메일 입니다');

    return await this.userRepository.save(createUserInput);
  }

  async delete({ userid }) {
    return await this.userRepository.delete({
      userid: userid,
    });
  }
}
