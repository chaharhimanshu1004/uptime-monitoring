/*
  Warnings:

  - Added the required column `reason` to the `Incident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `region` to the `Incident` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Incident" ADD COLUMN     "reason" TEXT NOT NULL,
ADD COLUMN     "region" TEXT NOT NULL;
