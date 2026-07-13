CREATE TABLE teacher (
                          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                          user_id UUID NOT NULL UNIQUE,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                          CONSTRAINT fk_teacher_user
                              FOREIGN KEY (user_id)
                                  REFERENCES users(id)
);