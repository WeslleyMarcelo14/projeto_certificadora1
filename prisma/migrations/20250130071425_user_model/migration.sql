/*
  Warnings:

  - Added the required column `type` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Account_providerAccountId_key";

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "type" TEXT NOT NULL,
ALTER COLUMN "provider" DROP DEFAULT;
