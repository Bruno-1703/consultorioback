import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AskInput {
  @Field(() => String)
  question: string;
}
