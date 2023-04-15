package favorites

import (
	entityFavorites "github.com/sebastianaldi17/maifavorite/backend-go/internal/entity/favorites"
)

func (u *Usecase) GetFavorites() ([]entityFavorites.Favorite, error) {
	return u.favoritesRes.GetFavorites()
}

func (u *Usecase) AddFavorite(chartID int64) error {
	return u.favoritesRes.AddFavorite(chartID)
}

func (u *Usecase) DeleteFavorite(chartID int64) error {
	return u.favoritesRes.DeleteFavorite(chartID)
}
