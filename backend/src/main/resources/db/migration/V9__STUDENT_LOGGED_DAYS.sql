CREATE TABLE student_logged_days (
                                     student_id UUID NOT NULL,
                                     logged_day DATE NOT NULL,

                                     CONSTRAINT fk_student_logged_days
                                         FOREIGN KEY (student_id)
                                             REFERENCES student(id)
                                             ON DELETE CASCADE
);
ALTER TABLE student_logged_days
    ADD CONSTRAINT uk_student_logged_day
        UNIQUE(student_id, logged_day);