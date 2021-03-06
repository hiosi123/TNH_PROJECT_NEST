import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import e from 'express';
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

  async count() {
    const result = await this.boardRepository.find();
    return result.length;
  }

  async findAll({ pagesize, page, userid, search }) {
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

    if (page && search) {
      return await this.boardRepository
        .createQueryBuilder('board')
        .leftJoinAndSelect('board.user', 'user')
        .skip(page)
        .take(10)
        .where('board.title like :title', { title: `%${search}%` })
        .orderBy('board.id', 'DESC')
        .getMany();

      // find({
      //   where: { title: `%${search}%` },
      //   order: {
      //     createdAt: 'DESC',
      //   },
      //   skip: (page - 1) * 10,
      //   take: 10,
      //   relations: ['user'],
      // });
    }
    if (userid && page) {
      return await this.boardRepository.find({
        order: {
          createdAt: 'DESC',
        },
        skip: (page - 1) * 10,
        take: 10,
        where: { user: { userid: userid } },
        relations: ['user'],
      });
    }

    if (page) {
      return await this.boardRepository.find({
        order: {
          createdAt: 'DESC',
        },
        skip: (page - 1) * 10,
        take: 10,
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

    return await this.boardRepository.find({
      order: {
        createdAt: 'DESC',
      },
      take: 10,
      relations: ['user'],
    });
  }

  async findOne({ boardid }) {
    const board = await this.boardRepository.findOne({
      where: { id: boardid },
      relations: ['user'],
    });

    await this.boardRepository.update(
      {
        id: boardid,
      },
      {
        viewcount: board.viewcount + 1,
      },
    );

    return board;
  }

  async create({ title, content, url, currentUser }) {
    const user = await this.userReposiotry.findOne({
      where: { userid: currentUser.userid },
    });

    return await this.boardRepository.save({
      title,
      content,
      url,
      user: user,
    });
  }
  async update({ title, content, boardid, url, currentUser }) {
    const oldBoard = await this.boardRepository.findOne({
      where: { id: boardid },
      relations: ['user'],
    });

    if (oldBoard.user.userid !== currentUser.userid) {
      throw new UnauthorizedException('????????? ????????? ????????????.');
    }

    let newBoard;
    if (title && content && url) {
      newBoard = { ...oldBoard, title, content, url };
    } else if (title && content) {
      newBoard = { ...oldBoard, title, content };
    } else if (title && url) {
      newBoard = { ...oldBoard, title, url };
    } else if (content && url) {
      newBoard = { ...oldBoard, content, url };
    } else if (title) {
      newBoard = { ...oldBoard, title };
    } else if (content) {
      newBoard = { ...oldBoard, content };
    } else if (url) {
      newBoard = { ...oldBoard, url };
    }

    return this.boardRepository.save(newBoard);
  }

  async delete({ boardid, currentUser }) {
    const findUserFromBoard = await this.boardRepository.findOne({
      where: { id: boardid },
      relations: ['user'],
    });

    if (findUserFromBoard.user.userid !== currentUser.userid) {
      throw new UnauthorizedException('????????? ????????? ????????????.');
    }

    const result = await this.boardRepository.delete({ id: boardid });

    return result.affected ? true : false;
  }

  async deleteAll({ boardid, currentUser }) {
    const findUserFromBoard = await this.boardRepository.findOne({
      where: { id: boardid },
      relations: ['user'],
    });

    if (findUserFromBoard.user.userid !== currentUser.userid) {
      throw new UnauthorizedException('????????? ????????? ????????????.');
    }
    try {
      for (let i = 0; i < boardid.length; i++) {
        await this.boardRepository.delete({ id: boardid[i] });
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
