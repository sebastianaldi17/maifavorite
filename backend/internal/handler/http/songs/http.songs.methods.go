package songs

import (
	"encoding/json"
	"log"
	"net/http"
)

func (h *Handler) GetSongs(w http.ResponseWriter, r *http.Request) {
	songs, err := h.songsUc.GetSongs()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	w.Header().Set("Content-Type", "application/json")
	jsonBytes, err := json.Marshal(songs)
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
