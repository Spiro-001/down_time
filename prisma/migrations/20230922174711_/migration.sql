/*
  Warnings:

  - You are about to drop the column `userId` on the `ChatUser` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ChatUser" DROP CONSTRAINT "ChatUser_userId_fkey";

-- AlterTable
ALTER TABLE "ChatUser" DROP COLUMN "userId",
ADD COLUMN     "usersId" TEXT[];

-- AddForeignKey
ALTER TABLE "ChatUser" ADD CONSTRAINT "ChatUser_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
