/*
  Warnings:

  - Added the required column `repoConfigId` to the `Repo` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DetailLevel" AS ENUM ('minimal', 'balanced', 'comprehensive');

-- AlterTable
ALTER TABLE "Repo" ADD COLUMN     "repoConfigId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "repoConfig" (
    "id" TEXT NOT NULL,
    "repoId" TEXT NOT NULL,
    "repoFullName" TEXT NOT NULL,
    "docsFolder" TEXT NOT NULL DEFAULT 'docs',
    "enabled" BOOLEAN NOT NULL,
    "detailLevel" "DetailLevel" NOT NULL,
    "includeExamples" BOOLEAN NOT NULL,
    "includeTypeInfo" BOOLEAN NOT NULL,
    "includedPaths" TEXT[],
    "excludedPaths" TEXT[],
    "fileTypes" TEXT[],
    "branches" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "repoConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InitialDocConfig" (
    "id" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "selectedFolders" TEXT[],
    "repoConfigId" TEXT NOT NULL,

    CONSTRAINT "InitialDocConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "repoConfig_repoId_key" ON "repoConfig"("repoId");

-- CreateIndex
CREATE INDEX "repoConfig_repoId_id_idx" ON "repoConfig"("repoId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "InitialDocConfig_repoConfigId_key" ON "InitialDocConfig"("repoConfigId");

-- CreateIndex
CREATE INDEX "Repo_id_repId_repOwnerId_repoConfigId_idx" ON "Repo"("id", "repId", "repOwnerId", "repoConfigId");

-- CreateIndex
CREATE INDEX "RepoLogs_id_repId_treeHash_commitHash_idx" ON "RepoLogs"("id", "repId", "treeHash", "commitHash");

-- CreateIndex
CREATE INDEX "User_id_email_idx" ON "User"("id", "email");

-- AddForeignKey
ALTER TABLE "repoConfig" ADD CONSTRAINT "repoConfig_repoId_fkey" FOREIGN KEY ("repoId") REFERENCES "Repo"("repId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InitialDocConfig" ADD CONSTRAINT "InitialDocConfig_repoConfigId_fkey" FOREIGN KEY ("repoConfigId") REFERENCES "repoConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;
