/*
  Warnings:

  - You are about to drop the column `custom_alias` on the `links` table. All the data in the column will be lost.
  - Made the column `short_code` on table `links` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "links_custom_alias_key";

-- AlterTable
ALTER TABLE "links" DROP COLUMN "custom_alias",
ALTER COLUMN "short_code" SET NOT NULL;
