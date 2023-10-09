-- DropForeignKey
ALTER TABLE `notes` DROP FOREIGN KEY `Notes_chaptersversetsId_fkey`;

-- AlterTable
ALTER TABLE `notes` MODIFY `chaptersversetsId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Notes` ADD CONSTRAINT `Notes_chaptersversetsId_fkey` FOREIGN KEY (`chaptersversetsId`) REFERENCES `ChaptersVersets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
