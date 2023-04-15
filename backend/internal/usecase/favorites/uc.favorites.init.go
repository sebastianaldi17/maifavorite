package favorites

type Usecase struct {
	favoritesRes favoritesResource
}

func New(favoritesRes favoritesResource) *Usecase {
	favoritesUsecase := Usecase{
		favoritesRes: favoritesRes,
	}

	return &favoritesUsecase
}
