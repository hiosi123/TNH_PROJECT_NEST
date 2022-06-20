import { Catch, ExceptionFilter, HttpException } from '@nestjs/common'; //2

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  //2 직접적으로 기능을 만들어라는 행동을 물려받는다? implements는 다중 구현이 된다.

  catch(exception: HttpException) {
    const status = exception.getStatus();
    const message = exception.message;

    console.log('=========================================');
    console.log('에러가 발생했어요');
    console.log('에러내용:', message);
    console.log('에러코드:', status);
    console.log('=========================================');
  }
}
