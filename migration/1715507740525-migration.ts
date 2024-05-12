import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1715507740525 implements MigrationInterface {
  name = 'Migration1715507740525';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "news" RENAME COLUMN "source" TO "sourceId"`);
    await queryRunner.query(`ALTER TABLE "feeds" DROP COLUMN "image"`);
    await queryRunner.query(`ALTER TABLE "sources" ADD "image" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "news" ALTER COLUMN "sourceId" DROP NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "news" ADD CONSTRAINT "FK_0b6e60aeb5ef9ce2da1bb1829d9" FOREIGN KEY ("sourceId") REFERENCES "sources"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "news" DROP CONSTRAINT "FK_0b6e60aeb5ef9ce2da1bb1829d9"`);
    await queryRunner.query(`ALTER TABLE "news" ALTER COLUMN "sourceId" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "sources" DROP COLUMN "image"`);
    await queryRunner.query(`ALTER TABLE "feeds" ADD "image" character varying`);
    await queryRunner.query(`ALTER TABLE "news" RENAME COLUMN "sourceId" TO "source"`);
  }
}
