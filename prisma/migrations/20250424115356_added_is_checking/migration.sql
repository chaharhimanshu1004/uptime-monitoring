/*
  Warnings:

  - You are about to drop the column `region` on the `Incident` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Incident" DROP COLUMN "region";

-- AlterTable
ALTER TABLE "Website" ADD COLUMN     "isChecking" BOOLEAN NOT NULL DEFAULT true;
