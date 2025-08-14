import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'agendas' })
export class Agenda {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100 })
    nombres!: string;

    @Column({ length: 100 })
    apellidos!: string;

    @Column({ type: 'date' })
    fecha_nacimiento!: string;

    @Column({ length: 200 })
    direccion!: string;

    @Column({ length: 30 })
    celular!: string;

    @Column({ length: 150, unique: true })
    correo!: string;
}
