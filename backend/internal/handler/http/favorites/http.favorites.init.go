package favorites

type Handler struct {
	favoritesUc favoritesUsecase
}

func New(favoritesUc favoritesUsecase) *Handler {
	favoritesHandler := Handler{
		favoritesUc: favoritesUc,
	}

	return &favoritesHandler
}
