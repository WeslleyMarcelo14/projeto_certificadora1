-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('URGENTE', 'IMPORTANTE', 'NORMAL');

-- AlterTable
ALTER TABLE "Tarefa" ADD COLUMN     "priority" "TaskPriority" NOT NULL DEFAULT 'NORMAL';
