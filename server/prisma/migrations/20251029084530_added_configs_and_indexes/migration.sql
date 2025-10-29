/*
  Warnings:

  - You are about to drop the column `repoConfigId` on the `Repo` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Repo_id_repId_repOwnerId_repoConfigId_idx";

-- AlterTable
ALTER TABLE "Repo" DROP COLUMN "repoConfigId";

-- CreateIndex
CREATE INDEX "Repo_id_repId_repOwnerId_idx" ON "Repo"("id", "repId", "repOwnerId");
