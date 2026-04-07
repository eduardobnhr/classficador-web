import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: string;

    @ApiProperty()
    @Column()
    name: string;

    @ApiProperty()
    @Column()
    email: string;

    @ApiProperty()
    @Column()
    password_hash: string;

    @ApiProperty()
    @Column()
    role: string;

    @ApiProperty()
    @Column()
    is_active: boolean;

    @ApiProperty()
    @Column()
    created_at: Date;

    @ApiProperty()
    @Column()
    updated_at: Date;
}
