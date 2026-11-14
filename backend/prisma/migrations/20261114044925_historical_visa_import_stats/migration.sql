-- CreateTable
CREATE TABLE `historical_visa_imports` (
    `id` VARCHAR(191) NOT NULL,
    `businessId` VARCHAR(191) NOT NULL,
    `sourceFile` VARCHAR(191) NOT NULL,
    `snapshotDate` DATETIME(3) NULL,
    `recordCount` INTEGER NOT NULL,
    `uniquePassportCount` INTEGER NOT NULL,
    `repeatedPassportEntries` INTEGER NOT NULL,
    `sheetCount` INTEGER NOT NULL,
    `statusCounts` JSON NOT NULL,
    `importedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `historical_visa_imports_businessId_importedAt_idx`(`businessId`, `importedAt`),
    UNIQUE INDEX `historical_visa_imports_businessId_sourceFile_key`(`businessId`, `sourceFile`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `historical_visa_imports` ADD CONSTRAINT `historical_visa_imports_businessId_fkey` FOREIGN KEY (`businessId`) REFERENCES `businesses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
