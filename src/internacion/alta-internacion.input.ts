import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AltaInternacionInput {
  @Field()
  id_internacion: string;

  @Field({ nullable: true })
  observaciones_alta?: string;
}
