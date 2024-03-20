import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CitaInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: true })
  id_paciente?: string;
  @Field(() => String)
  motivoConsulta: string;
  @Field(() => Date)
  fechaSolicitud: Date;
  @Field(() => Date, { nullable: true })
  fechaConfirmacion?: Date;
  @Field(() => String, { nullable: true })
  observaciones?: string;
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
}
