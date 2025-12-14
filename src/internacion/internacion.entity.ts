import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Cama } from './cama.entity';
import { Paciente } from 'src/paciente/paciente.dto';

@ObjectType()
export class Internacion {
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

  @Field()
  activa: boolean;

  @Field(() => Paciente)
  paciente: Paciente;

  @Field(() => Cama)
  cama: Cama;
}
