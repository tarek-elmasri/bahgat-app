import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("sessions")
export class Session extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  cartId: string;

  @Column({ nullable: true })
  access_token?: string;

  @Column({ nullable: true })
  refresh_token?: string;
}
