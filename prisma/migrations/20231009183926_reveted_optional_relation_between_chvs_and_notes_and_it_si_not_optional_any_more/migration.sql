/*
  Warnings:

  - Made the column `chaptersversetsId` on table `notes` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `notes` DROP FOREIGN KEY `Notes_chaptersversetsId_fkey`;

-- AlterTable
ALTER TABLE `notes` MODIFY `chaptersversetsId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Notes` ADD CONSTRAINT `Notes_chaptersversetsId_fkey` FOREIGN KEY (`chaptersversetsId`) REFERENCES `ChaptersVersets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
