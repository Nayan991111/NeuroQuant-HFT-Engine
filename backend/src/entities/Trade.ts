import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Portfolio } from "./Portfolio";

@Entity()
export class Trade {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    ticker!: string;

    @Column()
    type!: string; // "BUY" or "SELL"

    @Column("int")
    quantity!: number;

    @Column("decimal", { precision: 10, scale: 2 })
    price!: number;

    // 👇 NEW: Store the AI's confidence level for this trade
    @Column("float", { default: 0 })
    sentimentScore!: number;

    @Column()
    timestamp!: Date;

    @ManyToOne(() => Portfolio, (portfolio) => portfolio.trades)
    portfolio!: Portfolio;
}