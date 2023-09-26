/*
  Warnings:

  - You are about to drop the column `notifications` on the `Chat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "notifications";

-- AlterTable
ALTER TABLE "ChatUser" ADD COLUMN     "notifications" INTEGER NOT NULL DEFAULT 0;
