-- CreateTable
CREATE TABLE "class"."classes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "teacher_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class"."students" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class"."enrollments" (
    "id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "enrolled_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dropped_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class"."progress" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "skill_id" TEXT NOT NULL,
    "p_known" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "last_p_known" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "attempt_count" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "classes_teacher_id_idx" ON "class"."classes"("teacher_id");

-- CreateIndex
CREATE INDEX "classes_deleted_at_idx" ON "class"."classes"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "students_email_key" ON "class"."students"("email");

-- CreateIndex
CREATE INDEX "students_deleted_at_idx" ON "class"."students"("deleted_at");

-- CreateIndex
CREATE INDEX "enrollments_class_id_idx" ON "class"."enrollments"("class_id");

-- CreateIndex
CREATE INDEX "enrollments_student_id_idx" ON "class"."enrollments"("student_id");

-- CreateIndex
CREATE INDEX "enrollments_deleted_at_idx" ON "class"."enrollments"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "enrollments_class_id_student_id_key" ON "class"."enrollments"("class_id", "student_id");

-- CreateIndex
CREATE INDEX "progress_student_id_idx" ON "class"."progress"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "progress_student_id_skill_id_key" ON "class"."progress"("student_id", "skill_id");

-- AddForeignKey
ALTER TABLE "class"."enrollments" ADD CONSTRAINT "enrollments_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "class"."classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class"."enrollments" ADD CONSTRAINT "enrollments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "class"."students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class"."progress" ADD CONSTRAINT "progress_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "class"."students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
