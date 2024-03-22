import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CitaInput {
  @Field(() => String, { nullable: true })
  id_cita?: string;
  @Field(() => String, { nullable: true })
  id_paciente?: string;
  @Field(() => String, { nullable: true })
  motivoConsulta: string;
  @Field(() => Date)
  fechaSolicitud: Date;
  @Field(() => Date, { nullable: true })
  fechaConfirmacion?: Date;
  @Field(() => String, { nullable: true })
  observaciones?: string;
  @Field(() => Boolean, { nullable: true })
  cancelada?: boolean;
}
@InputType()
export class CitaWhereInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: true })
  id_paciente?: string;
  @Field(() => String, { nullable: true })
  motivoConsulta: string;
  @Field(() => Date, { nullable: true })
  fechaSolicitud?: Date;
  @Field(() => Date, { nullable: true })
  fechaConfirmacion?: Date;
  @Field(() => String, { nullable: true })
  observaciones?: string;
  @Field(() => Boolean, { nullable: true })
  cancelada?: boolean;
}
