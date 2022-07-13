import { Entity as Entity_, PrimaryColumn as PrimaryColumn_, Column as Column_ } from 'typeorm'

@Entity_()
export class PkexStakeAcct {
  constructor(props?: Partial<PkexStakeAcct>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_('text', { nullable: false })
  address!: string

  @Column_('numeric', { nullable: false })
  lastActionTime!: bigint
}
