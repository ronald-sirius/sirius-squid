module.exports = class Init1655212706060 {
  name = 'Init1655212706060'

  async up(db) {
    await db.query(`CREATE TABLE "lock" ("id" character varying NOT NULL, "address" text NOT NULL, "amount" numeric NOT NULL, "end" numeric NOT NULL, CONSTRAINT "PK_b47095fc0260d85601062b8ed1d" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "lock_system_info" ("id" character varying NOT NULL, "lock_count" numeric NOT NULL, "average_lock_time" numeric NOT NULL, "updated" numeric NOT NULL, "updated_at_block" integer NOT NULL, "updated_at_transaction" text NOT NULL, CONSTRAINT "PK_4d28decb4c8f262d855f0d5ab01" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "token" ("id" character varying NOT NULL, "address" text NOT NULL, "decimals" integer NOT NULL, "name" text, "symbol" text, CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "daily_volume" ("id" character varying NOT NULL, "timestamp" numeric NOT NULL, "volume" numeric NOT NULL, "swap_id" character varying NOT NULL, CONSTRAINT "PK_16b2e73f99fb121dcc9e90ffd32" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_46ce54619866aecbabbe96447c" ON "daily_volume" ("swap_id") `)
    await db.query(`CREATE TABLE "daily_tvl" ("id" character varying NOT NULL, "timestamp" numeric NOT NULL, "tvl" numeric NOT NULL, "swap_id" character varying NOT NULL, CONSTRAINT "PK_02680949226f3a9cc5e8fbb9c93" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_b76ee280bd4cda9b9304c9633b" ON "daily_tvl" ("swap_id") `)
    await db.query(`CREATE TABLE "swap" ("id" character varying NOT NULL, "address" text NOT NULL, "meta_pool" text NOT NULL, "base_pool" text NOT NULL, "tokens" text array NOT NULL, "tokens_symbol" text array NOT NULL, "base_tokens" text array NOT NULL, "base_tokens_symbol" text array NOT NULL, "underlying_tokens" text array NOT NULL, "underlying_tokens_symbol" text array NOT NULL, "balances" numeric array NOT NULL, "tvl" numeric NOT NULL, CONSTRAINT "PK_4a10d0f359339acef77e7f986d9" PRIMARY KEY ("id"))`)
    await db.query(`ALTER TABLE "daily_volume" ADD CONSTRAINT "FK_46ce54619866aecbabbe96447cd" FOREIGN KEY ("swap_id") REFERENCES "swap"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "daily_tvl" ADD CONSTRAINT "FK_b76ee280bd4cda9b9304c9633b5" FOREIGN KEY ("swap_id") REFERENCES "swap"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
  }

  async down(db) {
    await db.query(`DROP TABLE "lock"`)
    await db.query(`DROP TABLE "lock_system_info"`)
    await db.query(`DROP TABLE "token"`)
    await db.query(`DROP TABLE "daily_volume"`)
    await db.query(`DROP INDEX "public"."IDX_46ce54619866aecbabbe96447c"`)
    await db.query(`DROP TABLE "daily_tvl"`)
    await db.query(`DROP INDEX "public"."IDX_b76ee280bd4cda9b9304c9633b"`)
    await db.query(`DROP TABLE "swap"`)
    await db.query(`ALTER TABLE "daily_volume" DROP CONSTRAINT "FK_46ce54619866aecbabbe96447cd"`)
    await db.query(`ALTER TABLE "daily_tvl" DROP CONSTRAINT "FK_b76ee280bd4cda9b9304c9633b5"`)
  }
}
