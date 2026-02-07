-- CreateIndex
CREATE INDEX "recurring_tasks_base_task_id_idx" ON "recurring_tasks"("base_task_id");

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_recurring_task_id_fkey" FOREIGN KEY ("recurring_task_id") REFERENCES "recurring_tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurring_tasks" ADD CONSTRAINT "recurring_tasks_base_task_id_fkey" FOREIGN KEY ("base_task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
