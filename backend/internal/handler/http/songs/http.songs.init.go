package songs

type Handler struct {
	songsUc songsUsecase
}

func New(songsUc songsUsecase) *Handler {
	songsHandler := Handler{
		songsUc: songsUc,
	}

	return &songsHandler
}
