import { UseGuards } from '@nestjs/common';
import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.params';
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

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => [Board])
  createBoards(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('title') title: string, //
    @Args('content') content: string,
  ) {
    return this.boardService.create({ title, content, currentUser });
  }
}
