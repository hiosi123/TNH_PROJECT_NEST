import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

export class GqlAuthAccessGuard extends AuthGuard('access') {
  getRequest(context: ExecutionContext) {
    //context 는 원래 그래프용이아님, restapi 기준으로 요청을 받음
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req; //그래프 큐엘용 컨텍스트에서 뽑아서 리턴함
  }
}

export class GqlAuthRefreshGuard extends AuthGuard('refresh') {
  getRequest(context: ExecutionContext) {
    //context 는 원래 그래프용이아님, restapi 기준으로 요청을 받음
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req; //그래프 큐엘용 컨텍스트에서 뽑아서 리턴함
  }
}
