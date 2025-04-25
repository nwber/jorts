CREATE TABLE IF NOT EXISTS urls (
   short_id TEXT PRIMARY KEY,
   long_url TEXT NOT NULL
);

-- Insert some sample data into our comments table.
INSERT INTO urls (short_id, long_url)
VALUES
    ('12345', 'https://garfacts.com'),
    ('FFF', 'https://nbergeron.dev'),
    ('ABCDF', 'https://jorts.zip/')
;
