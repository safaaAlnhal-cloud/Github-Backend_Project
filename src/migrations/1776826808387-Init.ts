import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1776826808387 implements MigrationInterface {
    name = 'Init1776826808387'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "github_id" integer NOT NULL, "username" character varying NOT NULL, "name" character varying, "avatar_url" character varying NOT NULL, "bio" character varying, "public_repos" integer NOT NULL, "followers" integer NOT NULL, "following" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_45bb0502759f0dd73c4fd8b13bd" UNIQUE ("github_id"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "search_history" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "github_id" integer NOT NULL, "searched_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cb93c8f85dbdca85943ca494812" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "search_history"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
