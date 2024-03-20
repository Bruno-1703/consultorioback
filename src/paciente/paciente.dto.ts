import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { AggregateCount, Estudio } from '../estudios/estudio.dto';
import { Cita } from 'src/citas/cita.dto';
import { Medicamento } from 'src/medicamentos/medicamento.dto';
import { Enfermedad } from 'src/enfermedad/enfermedad.dto';

@ObjectType()
export class Paciente {
  @Field(() => String)
  id_paciente?: string;
  @Field(() => String)
  dni!: string;
  @Field(() => String, { nullable: true })
  nombre_paciente!: string;
  @Field(() => String)
  apellido_paciente!: string;
  @Field(() => Int)
  edad!: number;
  @Field(() => Int, { nullable: true })
  altura?: number;
  @Field(() => String)
  telefono: string;
  @Field(() => Date)
  fecha_nacimiento!: Date;
  @Field(() => String)
  sexo!: string;
  @Field(() => String)
  grupo_sanguineo!: string;
  @Field(() => String, { nullable: true })
  alergias?: string;

  @Field(() => [Cita], { nullable: true })
  citas?: Cita[];

  @Field(() => [Medicamento], { nullable: true })
  medicamentos?: Medicamento[];

  @Field(() => [Estudio], { nullable: true })
  estudios?: Estudio[];

  @Field(() => [Enfermedad], { nullable: true })
  enfermedades?: Enfermedad[];
}
@ObjectType()
export class PacienteEdge {
  @Field((_) => Paciente)
  node!: Paciente;
  @Field()
  cursor!: string;
}
@ObjectType()
export class PacientesResultadoBusqueda {
  @Field(() => [PacienteEdge])
  edges!: PacienteEdge[];
  @Field(() => AggregateCount)
  aggregate!: AggregateCount;
}
