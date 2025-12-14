import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Pabellon {
  @Field(() => ID)
  id_pabellon: string;

  @Field()
  nombre: string;

  @Field({ nullable: true })
  descripcion?: string;
}
