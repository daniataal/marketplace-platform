-- CreateTable
CREATE TABLE "Deal" (
    "id" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "commodity" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "pricePerKg" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "crowdfundingId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Deal_externalId_key" ON "Deal"("externalId");
