package favorites

import (
	"encoding/json"
	"log"
	"net/http"

	entityFavorites "github.com/sebastianaldi17/maifavorite/backend-go/internal/entity/favorites"
)

func (h *Handler) GetFavorites(w http.ResponseWriter, r *http.Request) {
	favorites, err := h.favoritesUc.GetFavorites()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	w.Header().Set("Content-Type", "application/json")
	jsonBytes, err := json.Marshal(favorites)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	_, err = w.Write(jsonBytes)
	if err != nil {
		log.Printf("Error writing to HTTP: %+v", err)
	}
}

func (h *Handler) AddFavorite(w http.ResponseWriter, r *http.Request) {
	var req entityFavorites.FavoriteReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	if req.ChartID <= 0 {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Chart ID must be bigger than 0"))
		return
	}

	err := h.favoritesUc.AddFavorite(req.ChartID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("OK"))
}

func (h *Handler) DeleteFavorite(w http.ResponseWriter, r *http.Request) {
	var req entityFavorites.FavoriteReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	if req.ChartID <= 0 {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Chart ID must be bigger than 0"))
		return
	}

	err := h.favoritesUc.DeleteFavorite(req.ChartID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("OK"))
}
