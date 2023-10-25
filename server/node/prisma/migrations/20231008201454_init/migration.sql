-- CreateTable
CREATE TABLE "Queue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "link" TEXT NOT NULL,
    "durationInSeconds" INTEGER NOT NULL,
    "satsAmount" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL
);
