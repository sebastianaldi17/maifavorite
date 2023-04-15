package favorites

import (
	entityFavorites "github.com/sebastianaldi17/maifavorite/backend-go/internal/entity/favorites"
)

//go:generate mockgen -build_flags=-mod=mod -source=uc.favorites.dependencies.go -package=favorites -destination=uc.favorites.dependencies.mock_test.go
type favoritesResource interface {
	AddFavorite(chartID int64) error
	DeleteFavorite(chartID int64) error
	GetFavorites() ([]entityFavorites.Favorite, error)
}
