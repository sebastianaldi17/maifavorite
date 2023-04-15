package songs

import (
	entitySongs "github.com/sebastianaldi17/maifavorite/backend-go/internal/entity/songs"
)

func (r *Resource) GetSongs() ([]entitySongs.Song, error) {
	songs := make([]entitySongs.Song, 0)
	err := r.db.Select(&songs, queryGetAllSongs)

	return songs, err
}
