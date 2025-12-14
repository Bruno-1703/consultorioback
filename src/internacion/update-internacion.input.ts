    import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateInternacionInput {
  @Field()
  id_internacion: string;

  @Field({ nullable: true })
  diagnostico?: string;

  @Field({ nullable: true })
  observaciones?: string;
}
