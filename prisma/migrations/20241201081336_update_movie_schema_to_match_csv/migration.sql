/*
  Warnings:

  - You are about to drop the column `directors` on the `movie` table. All the data in the column will be lost.
  - You are about to drop the column `genre` on the `movie` table. All the data in the column will be lost.
  - You are about to drop the column `gross` on the `movie` table. All the data in the column will be lost.
  - You are about to drop the column `metascore` on the `movie` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `movie` table. All the data in the column will be lost.
  - You are about to drop the column `plot` on the `movie` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `movie` table. All the data in the column will be lost.
  - You are about to drop the column `runtime` on the `movie` table. All the data in the column will be lost.
  - You are about to drop the column `stars` on the `movie` table. All the data in the column will be lost.
  - You are about to drop the column `votes` on the `movie` table. All the data in the column will be lost.
  - Added the required column `Genre` to the `movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Movie Name` to the `movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Rating` to the `movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Runtime (Min)` to the `movie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "movie" DROP COLUMN "directors",
DROP COLUMN "genre",
DROP COLUMN "gross",
DROP COLUMN "metascore",
DROP COLUMN "name",
DROP COLUMN "plot",
DROP COLUMN "rating",
DROP COLUMN "runtime",
DROP COLUMN "stars",
DROP COLUMN "votes",
ADD COLUMN     "Directors" TEXT,
ADD COLUMN     "Genre" TEXT NOT NULL,
ADD COLUMN     "Gross" DOUBLE PRECISION,
ADD COLUMN     "Metascore" INTEGER,
ADD COLUMN     "Movie Name" TEXT NOT NULL,
ADD COLUMN     "Plot" TEXT,
ADD COLUMN     "Rating" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "Runtime (Min)" INTEGER NOT NULL,
ADD COLUMN     "Stars" TEXT,
ADD COLUMN     "Votes" INTEGER;
