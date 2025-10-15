import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { Field, ObjectType } from '@nestjs/graphql';
import { AskService } from './ask.service';
import { AskInput } from './ask.input';

@ObjectType()
class AskResponse {
  @Field(() => String)
  answer: string;
}

@Resolver()
export class AskResolver {
  constructor(private readonly askService: AskService) {}

  @Mutation(() => AskResponse)
  async askIA(@Args('data') data: AskInput): Promise<AskResponse> {
    const answer = await this.askService.askQuestion(data.question);
    return { answer };
  }
}
