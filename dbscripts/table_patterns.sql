CREATE TABLE IF NOT EXISTS patterns (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    thumbnail_url VARCHAR NOT NULL,
    preview_url VARCHAR NOT NULL,
    youtube_url VARCHAR NOT NULL,

    UNIQUE(name)
);

CREATE TABLE IF NOT EXISTS chart_to_pattern (
    chart_id INTEGER NOT NULL REFERENCES charts(id),
    pattern_id INTEGER NOT NULL REFERENCES patterns(id),
    PRIMARY KEY (chart_id, pattern_id)
);

INSERT INTO patterns(name, youtube_url, thumbnail_url, preview_url)
VALUES
    ('trill', 'https://youtu.be/LQ1pOS8Rnlg?si=--IwQuL_Wvi3V-hF&t=15', '', ''),
    ('spin', 'https://youtu.be/YCd5nUkbj9E?si=f2aAouCaTlg_HCEF&t=20', '', ''),
    ('jack', 'https://youtu.be/pjJYNWvWpNo?si=usl8CqeDdaA2OxP5&t=149', '', ''),
    ('umiyuri', 'https://youtu.be/ANGign6Car8?si=1oYR6FxjpKxWc0YD&t=81', '', ''),
    ('gallop', 'https://youtu.be/EJfRxnSNZHc?si=X4qa_9NSD4Ov14HN&t=42', '', ''),
    ('zigzag', 'https://youtu.be/LX6Q31Yrnco?si=FUJNhwBUMn1yhpLe&t=63', '', ''),
    ('slide-tap', 'https://youtu.be/9rwdZ8oqfVs?si=Qj9N7Q6myD6kAcfm&t=37', '', ''),
    ('stream', 'https://youtu.be/4pVdhWrOSJE?si=4r4DkN9ttiAoOnLf&t=40', '', ''),
    ('3-stream', 'https://youtu.be/kMt20N3760U?si=xXZHLC6YRzQtqYAe&t=124', '', ''),
    ('anchor', 'https://youtu.be/PWSJOsK4FR4?si=HXeneQw1GG3F2OK9&t=70', '', ''),
    ('delay', 'https://youtu.be/aU_hXh7PZnI?si=I5I3kSPvTlSDkGIw&t=73', '', ''),
    ('triplet', 'https://youtu.be/ucUdisCKDto?si=Boz74pIE9cySqGdc&t=95', '', '');