import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateInternacionInput {
  @Field()
  pacienteId: string;

  @Field()
  camaId: string;

  @Field({ nullable: true })
  diagnostico?: string;

  @Field({ nullable: true })
  observaciones?: string;
}
