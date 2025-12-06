import { ObjectType, Field, ID } from '@nestjs/graphql';
import { AggregateCount, Estudio } from '../estudios/estudio.dto';
import { Medicamento } from 'src/medicamentos/medicamento.dto';
import { Enfermedad } from 'src/enfermedad/enfermedad.dto';
import { Paciente } from 'src/paciente/paciente.dto';
import { UsuarioInput } from 'src/users/usuario.input';
import { Usuario } from 'src/users/usuario.dto';

@ObjectType()
export class Cita {
  @Field(() => ID, { nullable: true })
  id_cita: string;

  @Field(() => String)
  motivoConsulta: string;

  @Field(() => String, { nullable: true })
  observaciones?: string;

  @Field({ nullable: true })
  fechaProgramada?: string;


  @Field(() => Boolean, { nullable: true })
  cancelada?: boolean;

  @Field(() => Boolean, { nullable: true })
  finalizada?: boolean;

  @Field(() => [Medicamento], { nullable: true })
  medicamentos?: Medicamento[];

  @Field(() => [Estudio], { nullable: true })
  estudios?: Estudio[];

  @Field(() => [Enfermedad], { nullable: true })
  enfermedades?: Enfermedad[];

  @Field(() => Paciente, { nullable: true })
  paciente?: Paciente;

  @Field(() => Usuario, { nullable: true })
  doctor?: Usuario;

  @Field(() => ID, { nullable: true })
  modificadoPorId?: string;

  @Field(() => ID, { nullable: true })
  registradoPorId?: string;
}

@ObjectType()
export class CitaEdge {
  @Field(() => Cita)
  node!: Cita;

  @Field()
  cursor!: string;
}

@ObjectType()
export class CitaResultadoBusqueda {
  @Field(() => [CitaEdge])
  edges!: CitaEdge[];

  @Field(() => AggregateCount)
  aggregate!: AggregateCount;
}
