package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/go-chi/render"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"github.com/sebastianaldi17/maifavorite/backend-go/internal/entity/config"
	favoritesHTTP "github.com/sebastianaldi17/maifavorite/backend-go/internal/handler/http/favorites"
	songsHTTP "github.com/sebastianaldi17/maifavorite/backend-go/internal/handler/http/songs"
	favoritesRes "github.com/sebastianaldi17/maifavorite/backend-go/internal/resource/favorites"
	songsRes "github.com/sebastianaldi17/maifavorite/backend-go/internal/resource/songs"
	favoritesUc "github.com/sebastianaldi17/maifavorite/backend-go/internal/usecase/favorites"
	songsUc "github.com/sebastianaldi17/maifavorite/backend-go/internal/usecase/songs"
)

type handlers struct {
	songsHTTP     *songsHTTP.Handler
	favoritesHTTP *favoritesHTTP.Handler
}

func main() {
	path, err := os.Getwd()
	if err != nil {
		log.Fatal(err)
	}

	configBytes, err := ioutil.ReadFile(path + "/db.json")
	if err != nil {
		log.Fatal(err)
	}

	var c config.DBConfig
	err = json.Unmarshal(configBytes, &c)
	if err != nil {
		log.Fatal(err)
	}

	connStr := fmt.Sprintf("postgres://%s:%s@%s/%s?sslmode=disable", c.User, c.Password, c.Host, c.DBName)
	log.Println(connStr)
	db, err := sqlx.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}

	// Resources
	favoritesRes := favoritesRes.New(db)
	songsRes := songsRes.New(db)

	// Usecases
	favoritesUc := favoritesUc.New(favoritesRes)
	songsUc := songsUc.New(songsRes)

	// Handlers
	favoritesHTTP := favoritesHTTP.New(favoritesUc)
	songsHTTP := songsHTTP.New(songsUc)

	var h handlers
	h.favoritesHTTP = favoritesHTTP
	h.songsHTTP = songsHTTP

	setupRouter(h)
}

func setupRouter(h handlers) {
	r := chi.NewRouter()
	r.Use(middleware.RequestID)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.URLFormat)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{"https://*", "http://*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
	}))
	r.Use(render.SetContentType(render.ContentTypeJSON))

	r.Get("/songs", h.songsHTTP.GetSongs)

	r.Route("/favorites", func(r chi.Router) {
		r.Get("/", h.favoritesHTTP.GetFavorites)
		r.Post("/", h.favoritesHTTP.AddFavorite)
		r.Delete("/", h.favoritesHTTP.DeleteFavorite)
	})

	log.Println("Running on port 3000")
	http.ListenAndServe(":3000", r)
}
