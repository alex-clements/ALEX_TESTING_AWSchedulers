/*
  Warnings:

  - You are about to alter the column `startTime` on the `Booking` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `endTime` on the `Booking` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `number` on the `Building` table. The data in that column could be lost. The data in that column will be cast from `UnsignedTinyInt` to `Int`.
  - You are about to alter the column `floorNumber` on the `Room` table. The data in that column could be lost. The data in that column will be cast from `UnsignedTinyInt` to `Int`.
  - You are about to alter the column `floorNumber` on the `User` table. The data in that column could be lost. The data in that column will be cast from `UnsignedTinyInt` to `Int`.
  - Made the column `location` on table `Building` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Booking` MODIFY `startTime` TIMESTAMP NULL,
    MODIFY `endTime` TIMESTAMP NULL;

-- AlterTable
ALTER TABLE `Building` MODIFY `number` INTEGER NOT NULL,
    MODIFY `location` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Room` MODIFY `floorNumber` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `floorNumber` INTEGER NOT NULL;
