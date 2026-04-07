import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Incident } from './incident.entity';

@Entity('users')
export class User {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @Column({ type: 'varchar', length: 120 })
    name: string;

    @ApiProperty()
    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Exclude()
    @Column({ type: 'varchar', length: 255 })
    password_hash: string;

    @ApiProperty()
    @Column({ type: 'varchar', length: 20, default: 'analyst' })
    role: string;

    @ApiProperty()
    @Column({ type: 'boolean', default: true })
    is_active: boolean;

    @ApiProperty()
    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @ApiProperty()
    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @OneToMany(() => Incident, incident => incident.user)
    incidents: Incident[];
}