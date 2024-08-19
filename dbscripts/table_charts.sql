CREATE TABLE IF NOT EXISTS charts (
    id SERIAL PRIMARY KEY,
    title_kana VARCHAR NOT NULL,
    type VARCHAR NOT NULL,
    difficulty VARCHAR NOT NULL,
    level VARCHAR NOT NULL,
    internal_level NUMERIC NOT NULL DEFAULT 0,
    last_update TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (title_kana, type, difficulty)
);

CREATE INDEX IF NOT EXISTS charts_title_kana_type_difficulty_idx
ON charts (title_kana, type, difficulty, id);
