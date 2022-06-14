import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {DailyVolume} from "./dailyVolume.model"
import {DailyTvl} from "./dailyTvl.model"

@Entity_()
export class Swap {
  constructor(props?: Partial<Swap>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  address!: string

  @Column_("text", {array: true, nullable: false})
  tokens!: (string)[]

  @Column_("text", {array: true, nullable: false})
  tokensSymbol!: (string)[]

  @Column_("text", {array: true, nullable: false})
  baseTokens!: (string)[]

  @Column_("text", {array: true, nullable: false})
  baseTokensSymbol!: (string)[]

  @Column_("text", {array: true, nullable: false})
  underlyingTokens!: (string)[]

  @Column_("text", {array: true, nullable: false})
  underlyingTokensSymbol!: (string)[]

  @Column_("numeric", {array: true, nullable: false})
  balances!: (bigint)[]

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  tvl!: bigint

  @OneToMany_(() => DailyVolume, e => e.swap)
  dailyVolumes!: DailyVolume[]

  @OneToMany_(() => DailyTvl, e => e.swap)
  dailyTvls!: DailyTvl[]
}
