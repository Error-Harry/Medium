-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false;
