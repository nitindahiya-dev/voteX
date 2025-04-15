/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
ADD COLUMN     "lastLogin" TIMESTAMP(3),
ALTER COLUMN "name" SET NOT NULL;
