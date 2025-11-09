package http

import (
	"net/http"

	"github.com/maximilianpw/rbi-inventory/internal/config"
	"github.com/maximilianpw/rbi-inventory/internal/database"
	"github.com/maximilianpw/rbi-inventory/internal/handlers/auth"
	"github.com/maximilianpw/rbi-inventory/internal/handlers/categories"
	"github.com/maximilianpw/rbi-inventory/internal/handlers/products"
	"github.com/maximilianpw/rbi-inventory/internal/handlers/users"
	"github.com/maximilianpw/rbi-inventory/internal/middleware"

	"github.com/gin-gonic/gin"
)

func BuildRouter(r *gin.Engine, db *database.DB, cfg *config.Config) {
	r.GET("/health-check", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	// Serve OpenAPI spec from workspace root
	r.GET("/openapi.yaml", func(ctx *gin.Context) {
		ctx.File("../../openapi.yaml")
	})

	// Protected API routes
	v1 := r.Group("/api/v1")
	v1.Use(middleware.AuthMiddleware(cfg)) // Apply auth middleware to all /api/v1 routes
	{
		// Auth routes (protected)
		authGroup := v1.Group("/auth")
		auth.BuildRoutes(authGroup, db, cfg)

		// Users routes (protected)
		usersGroup := v1.Group("/users")
		users.BuildRoutes(usersGroup, db)

		// Categories routes (protected)
		categoriesGroup := v1.Group("/categories")
		categories.BuildRoutes(categoriesGroup, db)

		// Products routes (protected)
		productsGroup := v1.Group("/products")
		products.BuildRoutes(productsGroup, db)
	}
}
