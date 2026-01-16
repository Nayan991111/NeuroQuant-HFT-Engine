import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "./User";
import { Trade } from "./Trade";

@Entity()
export class Portfolio {
    @PrimaryGeneratedColumn()
    id!: number;

    // 1. STATIC: The amount we started with (for calculating total profit/loss)
    @Column("decimal", { precision: 10, scale: 2, default: 100000 })
    initialCapital!: number;

    // 2. DYNAMIC: This is your 'Wallet'. Buying decreases this, Selling increases this.
    // We keep the name 'balance' to avoid breaking other files.
    @Column("decimal", { precision: 10, scale: 2, default: 100000 })
    balance!: number;

    @OneToOne(() => User, (user) => user.portfolio)
    @JoinColumn()
    user!: User;

    @OneToMany(() => Trade, (trade) => trade.portfolio)
    trades!: Trade[];
}