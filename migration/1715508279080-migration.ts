import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1715508279080 implements MigrationInterface {
  name = 'Migration1715508279080';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await queryRunner.query(
      `CREATE TYPE "public"."jobs_status_enum" AS ENUM('active', 'success', 'failure')`,
    );
    await queryRunner.query(
      `CREATE TABLE "jobs" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."jobs_status_enum" NOT NULL DEFAULT 'active', "feedsCount" integer, "itemsCount" integer, "reason" character varying, CONSTRAINT "PK_cf0a6c42b72fcc7f7c237def345" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sources" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" character varying NOT NULL, "title" character varying NOT NULL, "link" character varying NOT NULL, "image" character varying, "description" character varying, CONSTRAINT "PK_85523beafe5a2a6b90b02096443" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."news_category_enum" AS ENUM('general', 'top', 'local', 'finance', 'china', 'world', 'lifestyle', 'technology', 'entertainment', 'sports', 'politics', 'education', 'health', 'culture')`,
    );
    await queryRunner.query(
      `CREATE TABLE "news" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" character varying NOT NULL, "title" character varying NOT NULL, "link" character varying NOT NULL, "category" "public"."news_category_enum" NOT NULL DEFAULT 'general', "description" character varying, "image" character varying, "publishedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "keywords" text array, "sourceId" character varying, CONSTRAINT "PK_39a43dfcb6007180f04aff2357e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "feeds" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" character varying NOT NULL, "title" character varying NOT NULL, "description" character varying, "link" character varying, "sourceId" character varying, CONSTRAINT "PK_3dafbf766ecbb1eb2017732153f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "api_keys" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "key" character varying NOT NULL, CONSTRAINT "PK_e42cf55faeafdcce01a82d24849" PRIMARY KEY ("key"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "feeds_items_news" ("feedsId" character varying NOT NULL, "newsId" character varying NOT NULL, CONSTRAINT "PK_9e0033536ea0e209a6e306ffcac" PRIMARY KEY ("feedsId", "newsId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_de7906e7e9af1f5b1bfc1e9afa" ON "feeds_items_news" ("feedsId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f523912aed4b4852c478f43552" ON "feeds_items_news" ("newsId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "news" ADD CONSTRAINT "FK_0b6e60aeb5ef9ce2da1bb1829d9" FOREIGN KEY ("sourceId") REFERENCES "sources"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "feeds" ADD CONSTRAINT "FK_70ca367b22424bd6bf0d08a3c43" FOREIGN KEY ("sourceId") REFERENCES "sources"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "feeds_items_news" ADD CONSTRAINT "FK_de7906e7e9af1f5b1bfc1e9afa8" FOREIGN KEY ("feedsId") REFERENCES "feeds"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "feeds_items_news" ADD CONSTRAINT "FK_f523912aed4b4852c478f43552a" FOREIGN KEY ("newsId") REFERENCES "news"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "feeds_items_news" DROP CONSTRAINT "FK_f523912aed4b4852c478f43552a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "feeds_items_news" DROP CONSTRAINT "FK_de7906e7e9af1f5b1bfc1e9afa8"`,
    );
    await queryRunner.query(`ALTER TABLE "feeds" DROP CONSTRAINT "FK_70ca367b22424bd6bf0d08a3c43"`);
    await queryRunner.query(`ALTER TABLE "news" DROP CONSTRAINT "FK_0b6e60aeb5ef9ce2da1bb1829d9"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_f523912aed4b4852c478f43552"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_de7906e7e9af1f5b1bfc1e9afa"`);
    await queryRunner.query(`DROP TABLE "feeds_items_news"`);
    await queryRunner.query(`DROP TABLE "api_keys"`);
    await queryRunner.query(`DROP TABLE "feeds"`);
    await queryRunner.query(`DROP TABLE "news"`);
    await queryRunner.query(`DROP TYPE "public"."news_category_enum"`);
    await queryRunner.query(`DROP TABLE "sources"`);
    await queryRunner.query(`DROP TABLE "jobs"`);
    await queryRunner.query(`DROP TYPE "public"."jobs_status_enum"`);
  }
}
