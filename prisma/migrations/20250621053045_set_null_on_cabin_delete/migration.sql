-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_cabinId_fkey";

-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "cabinId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_cabinId_fkey" FOREIGN KEY ("cabinId") REFERENCES "Cabin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
