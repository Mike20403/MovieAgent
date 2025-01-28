/*
  Warnings:

  - You are about to drop the column `Directors` on the `movie` table. All the data in the column will be lost.
  - You are about to drop the column `Genre` on the `movie` table. All the data in the column will be lost.
  - You are about to drop the column `Gross` on the `movie` table. All the data in the column will be lost.
  - You are about to drop the column `Metascore` on the `movie` table. All the data in the column will be lost.
  - You are about to drop the column `Movie Name` on the `movie` table. All the data in the column will be lost.
  - You are about to drop the column `Plot` on the `movie` table. All the data in the column will be lost.
  - You are about to drop the column `Rating` on the `movie` table. All the data in the column will be lost.
  - You are about to drop the column `Runtime (Min)` on the `movie` table. All the data in the column will be lost.
  - You are about to drop the column `Stars` on the `movie` table. All the data in the column will be lost.
  - You are about to drop the column `Votes` on the `movie` table. All the data in the column will be lost.
  - Added the required column `genre` to the `movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `runtime` to the `movie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "movie" DROP COLUMN "Directors",
DROP COLUMN "Genre",
DROP COLUMN "Gross",
DROP COLUMN "Metascore",
DROP COLUMN "Movie Name",
DROP COLUMN "Plot",
DROP COLUMN "Rating",
DROP COLUMN "Runtime (Min)",
DROP COLUMN "Stars",
DROP COLUMN "Votes",
ADD COLUMN     "directors" TEXT,
ADD COLUMN     "genre" TEXT NOT NULL,
ADD COLUMN     "gross" DOUBLE PRECISION,
ADD COLUMN     "metascore" INTEGER,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "plot" TEXT,
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "runtime" INTEGER NOT NULL,
ADD COLUMN     "stars" TEXT,
ADD COLUMN     "votes" INTEGER;
