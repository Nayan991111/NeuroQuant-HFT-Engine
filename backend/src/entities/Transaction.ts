import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Portfolio } from "./Portfolio";

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column() // e.g., "AAPL", "GOOGL"
    symbol!: string;

    @Column() // "BUY" or "SELL"
    type!: string;

    @Column("int")
    quantity!: number;

    @Column("decimal", { precision: 10, scale: 2 })
    price_per_share!: number;

    @Column("decimal", { precision: 15, scale: 2 })
    total_amount!: number; // (quantity * price)

    // Link this trade to a specific Portfolio
    @ManyToOne(() => Portfolio, (portfolio) => portfolio.id)
    portfolio!: Portfolio;

    @Column()
    portfolioId!: string;

    @CreateDateColumn()
    createdAt!: Date;
}