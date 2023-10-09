/*
  Warnings:

  - You are about to drop the column `chaptersversetsId` on the `notes` table. All the data in the column will be lost.
  - You are about to drop the `chaptersversets` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `chaptersversesId` to the `Notes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `chaptersversets` DROP FOREIGN KEY `ChaptersVersets_bookId_fkey`;

-- DropForeignKey
ALTER TABLE `notes` DROP FOREIGN KEY `Notes_chaptersversetsId_fkey`;

-- AlterTable
ALTER TABLE `notes` DROP COLUMN `chaptersversetsId`,
    ADD COLUMN `chaptersversesId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `chaptersversets`;

-- CreateTable
CREATE TABLE `ChaptersVerses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `chapter` VARCHAR(191) NOT NULL,
    `verses` VARCHAR(191) NULL,
    `bookId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ChaptersVerses` ADD CONSTRAINT `ChaptersVerses_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `Book`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notes` ADD CONSTRAINT `Notes_chaptersversesId_fkey` FOREIGN KEY (`chaptersversesId`) REFERENCES `ChaptersVerses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
