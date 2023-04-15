package songs

type Usecase struct {
	songsRes songsResource
}

func New(songsRes songsResource) *Usecase {
	songsUsecase := Usecase{
		songsRes: songsRes,
	}

	return &songsUsecase
}
