package songs

import entitySongs "github.com/sebastianaldi17/maifavorite/backend-go/internal/entity/songs"

//go:generate mockgen -build_flags=-mod=mod -source=http.songs.dependencies.go -package=songs -destination=http.songs.dependencies.mock_test.go
type songsUsecase interface {
	GetSongs() ([]entitySongs.GetSongsResp, error)
}
