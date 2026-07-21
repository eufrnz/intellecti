ALTER TABLE contents
DROP COLUMN correct_answer,
DROP COLUMN explanation,
DROP COLUMN points;

CREATE TABLE question (

                          id UUID PRIMARY KEY,

                          content_id UUID NOT NULL UNIQUE,

                          correct_answer TEXT,

                          explanation TEXT,

                          points INTEGER,

                          CONSTRAINT fk_question_content
                              FOREIGN KEY (content_id)
                                  REFERENCES contents(id)
                                  ON DELETE CASCADE

);