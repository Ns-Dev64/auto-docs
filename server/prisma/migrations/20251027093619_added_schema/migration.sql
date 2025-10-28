-- CreateEnum
CREATE TYPE "LoginEnum" AS ENUM ('Github');

-- CreateEnum
CREATE TYPE "Logs" AS ENUM ('DOC_ADDED', 'DOC_UPDATED', 'DOC_REMOVED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "type" "LoginEnum" NOT NULL,
    "email" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Repo" (
    "id" TEXT NOT NULL,
    "repId" TEXT NOT NULL,
    "repName" TEXT NOT NULL,
    "repOwnerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Repo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RepoLogs" (
    "id" TEXT NOT NULL,
    "repId" TEXT NOT NULL,
    "fileHash" TEXT NOT NULL,
    "treeHash" TEXT NOT NULL,
    "commitHash" TEXT,
    "message" TEXT NOT NULL,
    "type" "Logs" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RepoLogs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Repo_repId_key" ON "Repo"("repId");

-- AddForeignKey
ALTER TABLE "Repo" ADD CONSTRAINT "Repo_repOwnerId_fkey" FOREIGN KEY ("repOwnerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepoLogs" ADD CONSTRAINT "RepoLogs_repId_fkey" FOREIGN KEY ("repId") REFERENCES "Repo"("repId") ON DELETE RESTRICT ON UPDATE CASCADE;
