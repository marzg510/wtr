-- Add migration script here
CREATE TABLE works (
    id INTEGER PRIMARY KEY,
    work_date DATE NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    work TEXT NOT NULL,
    project_id INTEGER
    task TEXT
);