import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Cama } from './cama.entity';

@ObjectType()
export class HistorialInternacion {
  @Field(() => ID)
  id_internacion: string;

  @Field(() => Date)
  fecha_ingreso: Date;

  @Field(() => Date, { nullable: true })
  fecha_alta?: Date;

  @Field()
  diagnostico: string;

  @Field({ nullable: true })
  observaciones?: string;

  @Field(() => Cama)
  cama: Cama;
}
