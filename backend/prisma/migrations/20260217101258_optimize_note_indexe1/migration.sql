-- DropIndex
DROP INDEX "Note_userId_updatedAt_createdAt_idx";

-- CreateIndex
CREATE INDEX "Note_userId_isDeleted_updatedAt_createdAt_idx" ON "Note"("userId", "isDeleted", "updatedAt" DESC, "createdAt" DESC);
