-- DropIndex
DROP INDEX "Note_createdAt_idx";

-- DropIndex
DROP INDEX "Note_userId_idx";

-- DropIndex
DROP INDEX "Note_userId_isDeleted_idx";

-- CreateIndex
CREATE INDEX "Note_userId_updatedAt_createdAt_idx" ON "Note"("userId", "updatedAt" DESC, "createdAt" DESC);
