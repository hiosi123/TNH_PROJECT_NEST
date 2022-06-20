import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CreateUserInput } from './dto/user.input';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(
    private readonly userService: UserService, //
  ) {}

  @Query(() => [User])
  fetchUsers() {
    return this.userService.findAll();
  }

  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    const hashedPassword = await bcrypt.hash(createUserInput.password, 10);

    createUserInput.password = hashedPassword;

    return this.userService.create({ createUserInput });
  }

  @Mutation(() => String)
  deleteUser(
    @Args('userid') userid: string, //
  ) {
    return this.userService.delete({ userid });
  }
}
