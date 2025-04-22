CREATE TABLE IF NOT EXISTS urls (
   short_id TEXT PRIMARY KEY,
   long_url TEXT NOT NULL
);

-- Insert some sample data into our comments table.
INSERT INTO urls (short_id, long_url)
VALUES
    ('12345', 'garfacts.com'),
    ('FFF', 'nbergeron.dev'),
    ('ABCDF', 'jorts.zip')
;
