import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Board } from './entities/board.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,

    @InjectRepository(User)
    private readonly userReposiotry: Repository<User>,
  ) {}

  async findAll({ pagesize, page, userid }) {
    if (page <= 0) {
      page = 1;
    }

    if (pagesize && page && userid) {
      return await this.boardRepository.find({
        order: {
          createdAt: 'DESC',
        },
        where: { user: { userid: userid } },
        skip: (page - 1) * pagesize,
        take: pagesize,
        relations: ['user'],
      });
    }

    if (pagesize && page) {
      return await this.boardRepository.find({
        order: {
          createdAt: 'DESC',
        },
        skip: (page - 1) * pagesize,
        take: pagesize,
        relations: ['user'],
      });
    }

    if (userid) {
      return await this.boardRepository.find({
        order: {
          createdAt: 'DESC',
        },
        where: { user: { userid: userid } },
        relations: ['user'],
      });
    }
  }

  async create({ title, content, currentUser }) {
    return await this.boardRepository.save({
      title,
      content,
      user: { userid: currentUser.userid },
    });
  }
}
