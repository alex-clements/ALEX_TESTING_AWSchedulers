/*
  Warnings:

  - You are about to alter the column `startTime` on the `Booking` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `endTime` on the `Booking` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `maxFloor` on the `Building` table. The data in that column could be lost. The data in that column will be cast from `Int` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `Booking` MODIFY `startTime` TIMESTAMP NULL,
    MODIFY `endTime` TIMESTAMP NULL;

-- AlterTable
ALTER TABLE `Building` MODIFY `maxFloor` TINYINT NOT NULL;
