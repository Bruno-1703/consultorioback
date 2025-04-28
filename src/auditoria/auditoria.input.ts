import { InputType, Field, ID } from '@nestjs/graphql';
import { registerEnumType } from '@nestjs/graphql';

export enum Accion {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  READ = 'READ',
  ARCHIVE = 'ARCHIVE',
}

// Registra el enum para usarlo en GraphQL
registerEnumType(Accion, {
  name: 'Accion', // Nombre que usará GraphQL
});


@InputType()
export class AuditoriaInput {
  @Field(() => ID, { nullable: true })
  id?: string; // ID de la auditoría, opcional si es una creación

  @Field(() => Date)
  fecha: Date; // Fecha de la acción de auditoría

  @Field(() => Accion, { nullable: true })
  accion?: Accion; // Enum de tipo Accion, indicando si fue crear, actualizar o eliminar

  @Field(() => String, { nullable: true })
  usuarioId?: string; // ID del usuario que realizó la acción

  @Field(() => String, { nullable: true })
  usuarioNom?: string; // Nombre o correo electrónico del usuario

  @Field(() => String, { nullable: true })
  detalles?: string; // Detalles de la acción realizada

  @Field(() => String, { nullable: true })
  observaciones?: string; // Observaciones adicionales sobre la acción

  @Field(() => Boolean, { nullable: true })
  urgente?: boolean; // Indica si la acción es urgente
  @Field(() => String, { nullable: true })
  modelo?: string;
}

@InputType()
export class AuditoriaWhereInput {
  @Field(() => ID, { nullable: true })
  id?: string; // ID de la auditoría para búsqueda

  @Field(() => Date, { nullable: true })
  fecha?: Date; // Fecha para buscar en auditorías

  @Field(() => Accion, { nullable: true })
  accion?: Accion; // Enum de tipo Accion, para buscar por tipo de acción

  @Field(() => String, { nullable: true })
  usuarioId?: string; // ID del usuario para buscar por usuario

  @Field(() => String, { nullable: true })
  detalles?: string; // Buscar por detalles en la auditoría
  @Field(() => String, { nullable: true })
  modelo?: string;
}