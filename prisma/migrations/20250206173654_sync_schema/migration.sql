-- CreateTable
CREATE TABLE "WebsiteStatus" (
    "id" TEXT NOT NULL,
    "websiteId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "responseTime" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebsiteStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WebsiteStatus_websiteId_timestamp_idx" ON "WebsiteStatus"("websiteId", "timestamp");

-- AddForeignKey
ALTER TABLE "WebsiteStatus" ADD CONSTRAINT "WebsiteStatus_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
