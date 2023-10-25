/*
  Warnings:

  - Added the required column `name` to the `Queue` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Queue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "link" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "durationInSeconds" INTEGER NOT NULL,
    "satsAmount" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL
);
INSERT INTO "new_Queue" ("createdAt", "durationInSeconds", "id", "link", "satsAmount", "status") SELECT "createdAt", "durationInSeconds", "id", "link", "satsAmount", "status" FROM "Queue";
DROP TABLE "Queue";
ALTER TABLE "new_Queue" RENAME TO "Queue";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
