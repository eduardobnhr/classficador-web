import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Classification } from './classification.entity';
import { User } from './user.entity';

@Entity('incidents')
@Index('idx_incidents_status', ['status'])
@Index('idx_incidents_user_id', ['user_id'])
export class Incident {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @Column({ type: 'uuid' })
    user_id: string;

    @ApiProperty()
    @Column({ type: 'varchar', length: 255 })
    title: string;

    @ApiProperty()
    @Column({ type: 'text' })
    description: string;

    @ApiProperty({ required: false })
    @Column({ type: 'timestamptz', nullable: true })
    occurred_at: Date;

    @ApiProperty()
    @Column({ type: 'varchar', length: 20, default: 'pending' })
    status: string;

    @ApiProperty()
    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @ApiProperty()
    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @ManyToOne(() => User, user => user.incidents, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToOne(() => Classification, classification => classification.incident)
    classification: Classification;
}