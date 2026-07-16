
CREATE TABLE study_plan (
                            id UUID PRIMARY KEY,

                            title VARCHAR(255) NOT NULL,

                            description TEXT,

                            teacher_id UUID NOT NULL,

                            study_plan_status VARCHAR(50) NOT NULL,

                            created_at TIMESTAMP NOT NULL,

                            updated_at TIMESTAMP,


                            CONSTRAINT fk_study_plan_teacher
                                FOREIGN KEY (teacher_id)
                                    REFERENCES teacher(id)
);



CREATE TABLE days (

                      id UUID PRIMARY KEY,

                      number INTEGER NOT NULL,

                      title VARCHAR(255) NOT NULL,

                      description TEXT NOT NULL,

                      study_plan_id UUID NOT NULL,


                      CONSTRAINT fk_days_study_plan
                          FOREIGN KEY (study_plan_id)
                              REFERENCES study_plan(id)
);




CREATE TABLE contents (

                          id UUID PRIMARY KEY,

                          day_id UUID NOT NULL,

                          title VARCHAR(255) NOT NULL,

                          type VARCHAR(50) NOT NULL,

                          content TEXT NOT NULL,

                          order_index INTEGER NOT NULL,

                          correct_answer VARCHAR(255),

                          explanation TEXT,

                          points INTEGER,


                          CONSTRAINT fk_contents_day
                              FOREIGN KEY (day_id)
                                  REFERENCES days(id)

);




CREATE TABLE assignments (

                             id UUID PRIMARY KEY,

                             study_plan_id UUID NOT NULL,

                             teacher_id UUID NOT NULL,

                             available_at TIMESTAMP NOT NULL,

                             due_date TIMESTAMP NOT NULL,

                             status VARCHAR(50) NOT NULL,

                             created_at TIMESTAMP NOT NULL,


                             CONSTRAINT fk_assignment_study_plan
                                 FOREIGN KEY (study_plan_id)
                                     REFERENCES study_plan(id),


                             CONSTRAINT fk_assignment_teacher
                                 FOREIGN KEY (teacher_id)
                                     REFERENCES teacher(id)

);





CREATE TABLE assignment_student (

                                    id UUID PRIMARY KEY,

                                    assignment_id UUID NOT NULL,

                                    student_id UUID NOT NULL,

                                    percentage DOUBLE PRECISION NOT NULL,

                                    completed BOOLEAN NOT NULL DEFAULT FALSE,

                                    completed_at TIMESTAMP,

                                    grade DOUBLE PRECISION,


                                    CONSTRAINT fk_assignment_student_assignment
                                        FOREIGN KEY (assignment_id)
                                            REFERENCES assignments(id),


                                    CONSTRAINT fk_assignment_student_student
                                        FOREIGN KEY (student_id)
                                            REFERENCES student(id)

);





CREATE TABLE student_progress (

                                  id UUID PRIMARY KEY,

                                  student_id UUID NOT NULL,

                                  assignment_id UUID NOT NULL,

                                  content_id UUID NOT NULL,

                                  completed BOOLEAN NOT NULL DEFAULT FALSE,

                                  completed_at TIMESTAMP,


                                  CONSTRAINT fk_student_progress_student
                                      FOREIGN KEY (student_id)
                                          REFERENCES student(id),


                                  CONSTRAINT fk_student_progress_assignment
                                      FOREIGN KEY (assignment_id)
                                          REFERENCES assignments(id),


                                  CONSTRAINT fk_student_progress_content
                                      FOREIGN KEY (content_id)
                                          REFERENCES contents(id)

);