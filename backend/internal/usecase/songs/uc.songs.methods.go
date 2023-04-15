package songs

import (
	"sort"

	entitySongs "github.com/sebastianaldi17/maifavorite/backend-go/internal/entity/songs"
)

func (u *Usecase) GetSongs() ([]entitySongs.GetSongsResp, error) {
	res := make([]entitySongs.GetSongsResp, 0)

	songs, err := u.songsRes.GetSongs()
	if err != nil {
		return res, err
	}
	songMetadata := make(map[string]entitySongs.SongMeta)
	chartsData := make(map[string][]entitySongs.Chart)
	for _, song := range songs {
		songMetadata[song.Title] = entitySongs.SongMeta{
			Title:    song.Title,
			Category: song.Category,
			Artist:   song.Artist,
			ImageURL: song.ImageURL,
			Version:  song.Version,
		}
		charts := chartsData[song.Title]
		charts = append(charts, entitySongs.Chart{
			ID:         song.ChartID,
			Type:       song.ChartType,
			Difficulty: song.ChartDifficulty,
			Level:      song.ChartLevel,
			IsFavorite: song.IsFavorite,
		})
		chartsData[song.Title] = charts
	}

	for _, meta := range songMetadata {
		res = append(res, entitySongs.GetSongsResp{
			Title:    meta.Title,
			Category: meta.Category,
			Artist:   meta.Artist,
			Version:  meta.Version,
			ImageURL: meta.ImageURL,
			Diff:     chartsData[meta.Title],
		})
	}

	sort.SliceStable(res, func(i, j int) bool {
		return res[i].Diff[0].ID < res[j].Diff[0].ID
	})

	return res, nil
}
