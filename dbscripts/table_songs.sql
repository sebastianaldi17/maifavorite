CREATE TABLE IF NOT EXISTS songs (
    title_kana VARCHAR PRIMARY KEY,
    title VARCHAR NOT NULL,
    category VARCHAR NOT NULL,
    artist VARCHAR NOT NULL,
    imageUrl VARCHAR NOT NULL,
    version VARCHAR NOT NULL,
    last_update TIMESTAMPTZ NOT NULL DEFAULT now(),

    INDEX idx_songs_category_artist_version (category, artist, version)
)