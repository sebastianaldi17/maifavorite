package songs

type Song struct {
	ChartID         int64  `json:"chart_id" db:"id"`
	ChartType       string `json:"chart_type" db:"type"`
	ChartDifficulty string `json:"chart_difficulty" db:"difficulty"`
	ChartLevel      string `json:"chart_level" db:"level"`
	Title           string `json:"title" db:"title"`
	Category        string `json:"category" db:"category"`
	Artist          string `json:"artist" db:"artist"`
	ImageURL        string `json:"image_url" db:"imageurl"`
	Version         string `json:"version" db:"version"`
	IsFavorite      bool   `json:"is_favorite" db:"is_favorite"`
}

type SongMeta struct {
	Title    string `json:"title"`
	Category string `json:"category"`
	Artist   string `json:"artist"`
	ImageURL string `json:"image_url"`
	Version  string `json:"version"`
}

type Chart struct {
	ID         int64  `json:"id"`
	Type       string `json:"type"`
	Difficulty string `json:"difficulty"`
	Level      string `json:"level"`
	IsFavorite bool   `json:"is_favorite"`
}

type GetSongsResp struct {
	Title    string  `json:"title"`
	Category string  `json:"category"`
	Artist   string  `json:"artist"`
	Version  string  `json:"version"`
	ImageURL string  `json:"image_url"`
	Diff     []Chart `json:"diff"`
}
