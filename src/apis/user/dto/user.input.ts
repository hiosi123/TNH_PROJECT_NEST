import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  userid: string;

  @Field(() => String, { nullable: true })
  password: string;
}
