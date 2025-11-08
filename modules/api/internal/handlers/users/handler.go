package users

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	bizusers "github.com/maximilianpw/rbi-inventory/internal/biz/users"
	"github.com/maximilianpw/rbi-inventory/internal/database"
	"github.com/maximilianpw/rbi-inventory/internal/handlers/users/dtos"
	"github.com/maximilianpw/rbi-inventory/internal/repository/users"
)

type userHandler struct {
	service bizusers.UserService
}

func (handler *userHandler) HandleGetUser(c *gin.Context) {
	id := c.Param("id")
	userID, err := uuid.Parse(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid UUID format"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	user, err := handler.service.GetByID(ctx, userID)
	if err != nil {
		if _, ok := err.(*bizusers.NotFoundError); ok {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user"})
		return
	}

	response := dtos.UserResponse{
		ID:        user.ID,
		Name:      user.Name,
		Email:     user.Email,
		Role:      user.Role,
		IsActive:  user.IsActive,
		LastLogin: user.LastLogin,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
	}

	c.JSON(http.StatusOK, response)
}

// HandleGetUsers retrieves all users with optional filters
func (handler *userHandler) HandleGetUsers(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	// Build filters from query parameters
	filters := make(map[string]interface{})

	if role := c.Query("role"); role != "" {
		filters["role"] = role
	}

	if active := c.Query("active"); active == "true" {
		filters["is_active"] = true
	} else if active == "false" {
		filters["is_active"] = false
	}

	users, err := handler.service.List(ctx, filters)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
		return
	}

	responses := make([]dtos.UserResponse, 0, len(users))
	for _, user := range users {
		responses = append(responses, dtos.UserResponse{
			ID:        user.ID,
			Name:      user.Name,
			Email:     user.Email,
			Role:      user.Role,
			IsActive:  user.IsActive,
			LastLogin: user.LastLogin,
			CreatedAt: user.CreatedAt,
			UpdatedAt: user.UpdatedAt,
		})
	}

	c.JSON(http.StatusOK, responses)
}

// HandleCreateUser creates a new user
func (handler *userHandler) HandleCreateUser(c *gin.Context) {
	var req dtos.CreateUserRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	user, err := handler.service.Create(ctx, req)
	if err != nil {
		if _, ok := err.(*bizusers.ConflictError); ok {
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	// Return created user
	response := dtos.UserResponse{
		ID:        user.ID,
		Name:      user.Name,
		Email:     user.Email,
		Role:      user.Role,
		IsActive:  user.IsActive,
		LastLogin: user.LastLogin,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
	}

	c.JSON(http.StatusCreated, response)
}

// HandleUpdateUser updates an existing user
func (handler *userHandler) HandleUpdateUser(c *gin.Context) {
	id := c.Param("id")
	userID, err := uuid.Parse(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid UUID format"})
		return
	}

	var req dtos.UpdateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	user, err := handler.service.Update(ctx, userID, req)
	if err != nil {
		if _, ok := err.(*bizusers.NotFoundError); ok {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}
		if _, ok := err.(*bizusers.ConflictError); ok {
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user"})
		return
	}

	// Return updated user
	response := dtos.UserResponse{
		ID:        user.ID,
		Name:      user.Name,
		Email:     user.Email,
		Role:      user.Role,
		IsActive:  user.IsActive,
		LastLogin: user.LastLogin,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
	}

	c.JSON(http.StatusOK, response)
}

// HandleDeleteUser deletes a user
func (handler *userHandler) HandleDeleteUser(c *gin.Context) {
	id := c.Param("id")
	userID, err := uuid.Parse(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid UUID format"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	err = handler.service.Delete(ctx, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}

// HandleDeactivateUser sets a user's is_active to false
func (handler *userHandler) HandleDeactivateUser(c *gin.Context) {
	id := c.Param("id")
	userID, err := uuid.Parse(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid UUID format"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	_, err = handler.service.Deactivate(ctx, userID)
	if err != nil {
		if _, ok := err.(*bizusers.NotFoundError); ok {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to deactivate user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User deactivated successfully"})
}

// HandleActivateUser sets a user's is_active to true
func (handler *userHandler) HandleActivateUser(c *gin.Context) {
	id := c.Param("id")
	userID, err := uuid.Parse(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid UUID format"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	_, err = handler.service.Activate(ctx, userID)
	if err != nil {
		if _, ok := err.(*bizusers.NotFoundError); ok {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to activate user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User activated successfully"})
}

// HandleSearchUsers searches users by name
func (handler *userHandler) HandleSearchUsers(c *gin.Context) {
	query := c.Query("q")
	if query == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Search query is required"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	users, err := handler.service.SearchByName(ctx, query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to search users"})
		return
	}

	responses := make([]dtos.UserResponse, 0, len(users))
	for _, user := range users {
		responses = append(responses, dtos.UserResponse{
			ID:        user.ID,
			Name:      user.Name,
			Email:     user.Email,
			Role:      user.Role,
			IsActive:  user.IsActive,
			LastLogin: user.LastLogin,
			CreatedAt: user.CreatedAt,
			UpdatedAt: user.UpdatedAt,
		})
	}

	c.JSON(http.StatusOK, responses)
}

func NewHandler(db *database.DB) *userHandler {
	userRepo := users.NewRepository(db.DB)
	userService := bizusers.NewService(userRepo)
	return &userHandler{service: userService}
}

func BuildRoutes(rg *gin.RouterGroup, db *database.DB) {
	handler := NewHandler(db)

	// GET routes
	rg.GET("", handler.HandleGetUsers)           // GET /users?role=ADMIN&active=true
	rg.GET("/search", handler.HandleSearchUsers) // GET /users/search?q=max
	rg.GET("/:id", handler.HandleGetUser)        // GET /users/:id

	// POST routes
	rg.POST("", handler.HandleCreateUser)                    // POST /users
	rg.POST("/:id/deactivate", handler.HandleDeactivateUser) // POST /users/:id/deactivate
	rg.POST("/:id/activate", handler.HandleActivateUser)     // POST /users/:id/activate

	// PUT routes
	rg.PUT("/:id", handler.HandleUpdateUser) // PUT /users/:id

	// DELETE routes
	rg.DELETE("/:id", handler.HandleDeleteUser) // DELETE /users/:id
}
