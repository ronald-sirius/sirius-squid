import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class LockSystemInfo {
  constructor(props?: Partial<LockSystemInfo>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  lockCount!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  averageLockTime!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  updated!: bigint

  @Column_("integer", {nullable: false})
  updatedAtBlock!: number

  @Column_("text", {nullable: false})
  updatedAtTransaction!: string
}
