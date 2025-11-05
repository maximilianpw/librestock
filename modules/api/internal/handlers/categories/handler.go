package categories

import (
	"context"
	"database/sql"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"github.com/maximilianpw/rbi-inventory/internal/database"
	"github.com/maximilianpw/rbi-inventory/internal/handlers/categories/dtos"
	"github.com/maximilianpw/rbi-inventory/internal/repository/categories"
)

type categoryHandler struct {
	repo categories.CategoryRepository
}

// GET /categories - List all categories
func (h *categoryHandler) HandleGetCategories(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	categories, err := h.repo.List(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch categories"})
		return
	}

	responses := make([]dtos.CategoryWithChildrenResponse, 0, len(categories))
	for _, cat := range categories {
		children, err := h.repo.GetChildren(ctx, cat.ID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch category children"})
			return
		}

		childResponses := make([]dtos.CategoryResponse, 0, len(children))
		for _, child := range children {
			childResponses = append(childResponses, dtos.CategoryResponse{
				ID:          child.ID,
				Name:        child.Name,
				ParentID:    child.ParentID,
				Description: child.Description,
				CreatedAt:   child.CreatedAt,
				UpdatedAt:   child.UpdatedAt,
			})
		}

		responses = append(responses, dtos.CategoryWithChildrenResponse{
			ID:          cat.ID,
			Name:        cat.Name,
			ParentID:    cat.ParentID,
			Description: cat.Description,
			Children:    childResponses,
			CreatedAt:   cat.CreatedAt,
			UpdatedAt:   cat.UpdatedAt,
		})
	}

	c.JSON(http.StatusOK, responses)
}

// POST /categories - Create category
func (h *categoryHandler) HandleCreateCategory(c *gin.Context) {
	var req dtos.CreateCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	category := req.ToModel()

	err := h.repo.Create(ctx, category)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create category"})
		return
	}

	response := dtos.CategoryResponse{
		ID:          category.ID,
		Name:        category.Name,
		ParentID:    category.ParentID,
		Description: category.Description,
		CreatedAt:   category.CreatedAt,
		UpdatedAt:   category.UpdatedAt,
	}

	c.JSON(http.StatusCreated, response)
}

// PUT /categories/:id - Update category
func (h *categoryHandler) HandleUpdateCategory(c *gin.Context) {
	id := c.Param("id")
	categoryID, err := uuid.Parse(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid UUID format"})
		return
	}

	var req dtos.UpdateCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	category, err := h.repo.GetByID(ctx, categoryID)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Category not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch category"})
		return
	}

	if req.Name != nil {
		category.Name = *req.Name
	}
	if req.ParentID != nil {
		category.ParentID = req.ParentID
	}
	if req.Description != nil {
		category.Description = req.Description
	}

	err = h.repo.Update(ctx, category)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update category"})
		return
	}

	response := dtos.CategoryResponse{
		ID:          category.ID,
		Name:        category.Name,
		ParentID:    category.ParentID,
		Description: category.Description,
		CreatedAt:   category.CreatedAt,
		UpdatedAt:   category.UpdatedAt,
	}

	c.JSON(http.StatusOK, response)
}

// DELETE /categories/:id - Delete category
func (h *categoryHandler) HandleDeleteCategory(c *gin.Context) {
	id := c.Param("id")
	categoryID, err := uuid.Parse(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid UUID format"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	err = h.repo.Delete(ctx, categoryID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete category"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Category deleted successfully"})
}

func NewHandler(db *database.DB) *categoryHandler {
	categoryRepo := categories.NewRepository(db.DB)
	return &categoryHandler{repo: categoryRepo}
}

func BuildRoutes(rg *gin.RouterGroup, db *database.DB) {
	handler := NewHandler(db)

	rg.GET("", handler.HandleGetCategories)         // GET /categories
	rg.POST("", handler.HandleCreateCategory)       // POST /categories
	rg.PUT("/:id", handler.HandleUpdateCategory)    // PUT /categories/:id
	rg.DELETE("/:id", handler.HandleDeleteCategory) // DELETE /categories/:id
}
