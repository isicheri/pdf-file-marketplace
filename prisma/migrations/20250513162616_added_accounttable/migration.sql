-- CreateTable
CREATE TABLE "SellerAccount" (
    "id" TEXT NOT NULL,
    "businessName" TEXT,
    "bankCode" TEXT,
    "accountNumber" INTEGER NOT NULL,
    "percentage" TEXT DEFAULT '10',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "sellerId" TEXT NOT NULL,

    CONSTRAINT "SellerAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SellerAccount_businessName_key" ON "SellerAccount"("businessName");

-- CreateIndex
CREATE UNIQUE INDEX "SellerAccount_accountNumber_key" ON "SellerAccount"("accountNumber");

-- CreateIndex
CREATE UNIQUE INDEX "SellerAccount_sellerId_key" ON "SellerAccount"("sellerId");

-- AddForeignKey
ALTER TABLE "SellerAccount" ADD CONSTRAINT "SellerAccount_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
