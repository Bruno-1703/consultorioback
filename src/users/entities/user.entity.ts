import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  //@Column({ primary: true, generated: true })
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({nullable: false})
  password: string;

  @DeleteDateColumn()
  deletdAr: Date;

  @Column({ default: 'user' })
  rol: string;
}
