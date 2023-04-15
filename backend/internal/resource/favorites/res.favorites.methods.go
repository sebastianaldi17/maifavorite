package favorites

import (
	entityFavorites "github.com/sebastianaldi17/maifavorite/backend-go/internal/entity/favorites"
)

func (r *Resource) GetFavorites() ([]entityFavorites.Favorite, error) {
	favorites := make([]entityFavorites.Favorite, 0)
	err := r.db.Select(&favorites, queryGetAllFavorites)
	return favorites, err
}

func (r *Resource) AddFavorite(chartID int64) error {
	_, err := r.db.Exec(queryAddFavorite, chartID)
	return err
}

func (r *Resource) DeleteFavorite(chartID int64) error {
	_, err := r.db.Exec(queryDeleteFavorite, chartID)
	return err
}
