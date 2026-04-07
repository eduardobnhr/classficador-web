import { Column, CreateDateColumn, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Incident } from './incident.entity';

@Entity('classifications')
@Index('idx_classifications_category', ['category'])
export class Classification {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @Column({ type: 'uuid' })
    incident_id: string;

    @ApiProperty()
    @Column({ type: 'varchar', length: 50 })
    category: string;

    @ApiProperty()
    @Column({ type: 'varchar', length: 20 })
    severity: string;

    @ApiProperty()
    @Column({ type: 'numeric', precision: 5, scale: 4 })
    confidence_score: number;

    @ApiProperty({ required: false })
    @Column({ type: 'text', nullable: true })
    explanation: string;

    @ApiProperty({ required: false })
    @Column({ type: 'text', nullable: true })
    recommended_actions: string;

    @ApiProperty({ required: false })
    @Column({ type: 'varchar', length: 50, nullable: true })
    model_version: string;

    @ApiProperty()
    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    classified_at: Date;

    @OneToOne(() => Incident, incident => incident.classification, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'incident_id' })
    incident: Incident;
}