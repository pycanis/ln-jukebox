/*
  Warnings:

  - A unique constraint covering the columns `[paymentRequest]` on the table `Queue` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Queue_paymentRequest_key" ON "Queue"("paymentRequest");
