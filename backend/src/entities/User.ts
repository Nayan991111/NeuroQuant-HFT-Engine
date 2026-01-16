import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { Portfolio } from "./Portfolio";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    username!: string;

    // This was missing, causing the error in AuthController
    @Column()
    password!: string;

    @OneToOne(() => Portfolio, (portfolio) => portfolio.user)
    portfolio!: Portfolio;
}