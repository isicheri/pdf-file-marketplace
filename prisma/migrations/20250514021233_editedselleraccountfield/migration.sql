-- DropIndex
DROP INDEX "SellerAccount_accountNumber_key";

-- AlterTable
ALTER TABLE "SellerAccount" ALTER COLUMN "accountNumber" SET DATA TYPE TEXT;
