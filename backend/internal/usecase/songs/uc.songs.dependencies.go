package songs

import entitySongs "github.com/sebastianaldi17/maifavorite/backend-go/internal/entity/songs"

//go:generate mockgen -build_flags=-mod=mod -source=uc.songs.dependencies.go -package=songs -destination=uc.songs.dependencies.mock_test.go
type songsResource interface {
	GetSongs() ([]entitySongs.Song, error)
}
