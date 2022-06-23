import { UseGuards } from '@nestjs/common';
import { Args, Resolver, Query, Mutation, Int } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.params';
import { MessagePort } from 'worker_threads';
import { BoardService } from './board.service';
import { Board } from './entities/board.entity';

@Resolver()
export class BoardResolver {
  constructor(private readonly boardService: BoardService) {}

  @Query(() => [Board])
  fetchBoards(
    @Args('pagesize', { nullable: true }) pagesize: number, //
    @Args('page', { nullable: true }) page: number,
    @Args('userId', { nullable: true }) userid: string,
  ) {
    return this.boardService.findAll({ pagesize, page, userid });
  }

  @Query(() => Number)
  fetchBoardsCount() {
    return this.boardService.count();
  }

  @Query(() => Board)
  fetchBoard(
    @Args('boardid') boardid: number, //
  ) {
    return this.boardService.findOne({ boardid });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Board)
  createBoard(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('title') title: string, //
    @Args('content') content: string,
    @Args('url', { nullable: true }) url: string,
  ) {
    return this.boardService.create({ title, content, url, currentUser });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Board)
  updateBoard(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('boardid') boardid: number,
    @Args('title', { nullable: true }) title: string,
    @Args('content', { nullable: true }) content: string,
    @Args('url', { nullable: true }) url: string,
  ) {
    return this.boardService.update({
      title,
      content,
      boardid,
      url,
      currentUser,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteBoard(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('boardid') boardid: number,
  ) {
    return this.boardService.delete({ boardid, currentUser });
  }
}
