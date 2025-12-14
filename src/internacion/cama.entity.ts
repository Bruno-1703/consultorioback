import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Pabellon } from './pabellon.entity';

@ObjectType()
export class Cama {
  @Field(() => ID)
  id_cama: string;

  @Field()
  numero: string;

  @Field()
  disponible: boolean;

  @Field(() => Pabellon, { nullable: true })
  pabellon?: Pabellon;
}
