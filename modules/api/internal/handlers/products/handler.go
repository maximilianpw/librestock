package products

import (
	"context"
	"database/sql"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"github.com/maximilianpw/rbi-inventory/internal/database"
	"github.com/maximilianpw/rbi-inventory/internal/handlers/products/dtos"
	"github.com/maximilianpw/rbi-inventory/internal/repository/products"
)

type productHandler struct {
	repo products.ProductRepository
}

func NewHandler(db *database.DB) *productHandler {
	productRepo := products.NewRepository(db.DB)
	return &productHandler{repo: productRepo}
}

// GET /products - List all products
func (h *productHandler) HandleGetProducts(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	products, err := h.repo.List(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch products"})
		return
	}

	responses := make([]dtos.ProductResponse, 0, len(products))
	for _, product := range products {
		responses = append(responses, dtos.ProductResponse{
			ID:                product.ID,
			SKU:               product.SKU,
			Name:              product.Name,
			Description:       product.Description,
			CategoryID:        product.CategoryID,
			BrandID:           product.BrandID,
			VolumeML:          product.VolumeML,
			WeightKG:          product.WeightKG,
			DimensionsCM:      product.DimensionsCM,
			StandardCost:      product.StandardCost,
			StandardPrice:     product.StandardPrice,
			MarkupPercentage:  product.MarkupPercentage,
			ReorderPoint:      product.ReorderPoint,
			PrimarySupplierID: product.PrimarySupplierID,
			SupplierSKU:       product.SupplierSKU,
			IsActive:          product.IsActive,
			IsPerishable:      product.IsPerishable,
			Notes:             product.Notes,
			CreatedAt:         product.CreatedAt,
			UpdatedAt:         product.UpdatedAt,
		})
	}

	c.JSON(http.StatusOK, responses)
}

// GET /products/:id - Get product by ID
func (h *productHandler) HandleGetProduct(c *gin.Context) {
	id := c.Param("id")
	productID, err := uuid.Parse(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid UUID format"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	product, err := h.repo.GetByID(ctx, productID)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch product"})
		return
	}

	response := dtos.ProductResponse{
		ID:                product.ID,
		SKU:               product.SKU,
		Name:              product.Name,
		Description:       product.Description,
		CategoryID:        product.CategoryID,
		BrandID:           product.BrandID,
		VolumeML:          product.VolumeML,
		WeightKG:          product.WeightKG,
		DimensionsCM:      product.DimensionsCM,
		StandardCost:      product.StandardCost,
		StandardPrice:     product.StandardPrice,
		MarkupPercentage:  product.MarkupPercentage,
		ReorderPoint:      product.ReorderPoint,
		PrimarySupplierID: product.PrimarySupplierID,
		SupplierSKU:       product.SupplierSKU,
		IsActive:          product.IsActive,
		IsPerishable:      product.IsPerishable,
		Notes:             product.Notes,
		CreatedAt:         product.CreatedAt,
		UpdatedAt:         product.UpdatedAt,
	}

	c.JSON(http.StatusOK, response)
}

// GET /products/category/:categoryId
func (h *productHandler) HandleGetProductsByCategory(c *gin.Context) {
	categoryIDStr := c.Param("categoryId")
	categoryID, err := uuid.Parse(categoryIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid category UUID format"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	products, err := h.repo.GetByCategory(ctx, categoryID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch products"})
		return
	}

	responses := make([]dtos.ProductResponse, 0, len(products))
	for _, product := range products {
		responses = append(responses, dtos.ProductResponse{
			ID:                product.ID,
			SKU:               product.SKU,
			Name:              product.Name,
			Description:       product.Description,
			CategoryID:        product.CategoryID,
			BrandID:           product.BrandID,
			VolumeML:          product.VolumeML,
			WeightKG:          product.WeightKG,
			DimensionsCM:      product.DimensionsCM,
			StandardCost:      product.StandardCost,
			StandardPrice:     product.StandardPrice,
			MarkupPercentage:  product.MarkupPercentage,
			ReorderPoint:      product.ReorderPoint,
			PrimarySupplierID: product.PrimarySupplierID,
			SupplierSKU:       product.SupplierSKU,
			IsActive:          product.IsActive,
			IsPerishable:      product.IsPerishable,
			Notes:             product.Notes,
			CreatedAt:         product.CreatedAt,
			UpdatedAt:         product.UpdatedAt,
		})
	}

	c.JSON(http.StatusOK, responses)
}

// GET /products/category/:categoryId/tree - Get products by category and all its children
func (h *productHandler) HandleGetProductsByCategoryTree(c *gin.Context) {
	categoryIDStr := c.Param("categoryId")
	categoryID, err := uuid.Parse(categoryIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid category UUID format"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	products, err := h.repo.GetByCategoryWithChildren(ctx, categoryID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch products"})
		return
	}

	responses := make([]dtos.ProductResponse, 0, len(products))
	for _, product := range products {
		responses = append(responses, dtos.ProductResponse{
			ID:                product.ID,
			SKU:               product.SKU,
			Name:              product.Name,
			Description:       product.Description,
			CategoryID:        product.CategoryID,
			BrandID:           product.BrandID,
			VolumeML:          product.VolumeML,
			WeightKG:          product.WeightKG,
			DimensionsCM:      product.DimensionsCM,
			StandardCost:      product.StandardCost,
			StandardPrice:     product.StandardPrice,
			MarkupPercentage:  product.MarkupPercentage,
			ReorderPoint:      product.ReorderPoint,
			PrimarySupplierID: product.PrimarySupplierID,
			SupplierSKU:       product.SupplierSKU,
			IsActive:          product.IsActive,
			IsPerishable:      product.IsPerishable,
			Notes:             product.Notes,
			CreatedAt:         product.CreatedAt,
			UpdatedAt:         product.UpdatedAt,
		})
	}

	c.JSON(http.StatusOK, responses)
}

// POST /products - Create product
func (h *productHandler) HandleCreateProduct(c *gin.Context) {
	var req dtos.CreateProductRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	product := req.ToModel()

	err := h.repo.Create(ctx, product)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create product"})
		return
	}

	response := dtos.ProductResponse{
		ID:                product.ID,
		SKU:               product.SKU,
		Name:              product.Name,
		Description:       product.Description,
		CategoryID:        product.CategoryID,
		BrandID:           product.BrandID,
		VolumeML:          product.VolumeML,
		WeightKG:          product.WeightKG,
		DimensionsCM:      product.DimensionsCM,
		StandardCost:      product.StandardCost,
		StandardPrice:     product.StandardPrice,
		MarkupPercentage:  product.MarkupPercentage,
		ReorderPoint:      product.ReorderPoint,
		PrimarySupplierID: product.PrimarySupplierID,
		SupplierSKU:       product.SupplierSKU,
		IsActive:          product.IsActive,
		IsPerishable:      product.IsPerishable,
		Notes:             product.Notes,
		CreatedAt:         product.CreatedAt,
		UpdatedAt:         product.UpdatedAt,
	}

	c.JSON(http.StatusCreated, response)
}

// PUT /products/:id - Update product
func (h *productHandler) HandleUpdateProduct(c *gin.Context) {
	id := c.Param("id")
	productID, err := uuid.Parse(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid UUID format"})
		return
	}

	var req dtos.UpdateProductRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	product, err := h.repo.GetByID(ctx, productID)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch product"})
		return
	}

	// Apply updates
	if req.SKU != nil {
		product.SKU = *req.SKU
	}
	if req.Name != nil {
		product.Name = *req.Name
	}
	if req.Description != nil {
		product.Description = req.Description
	}
	if req.CategoryID != nil {
		product.CategoryID = *req.CategoryID
	}
	if req.BrandID != nil {
		product.BrandID = req.BrandID
	}
	if req.VolumeML != nil {
		product.VolumeML = req.VolumeML
	}
	if req.WeightKG != nil {
		product.WeightKG = req.WeightKG
	}
	if req.DimensionsCM != nil {
		product.DimensionsCM = req.DimensionsCM
	}
	if req.StandardCost != nil {
		product.StandardCost = req.StandardCost
	}
	if req.StandardPrice != nil {
		product.StandardPrice = req.StandardPrice
	}
	if req.MarkupPercentage != nil {
		product.MarkupPercentage = req.MarkupPercentage
	}
	if req.ReorderPoint != nil {
		product.ReorderPoint = *req.ReorderPoint
	}
	if req.PrimarySupplierID != nil {
		product.PrimarySupplierID = req.PrimarySupplierID
	}
	if req.SupplierSKU != nil {
		product.SupplierSKU = req.SupplierSKU
	}
	if req.IsActive != nil {
		product.IsActive = *req.IsActive
	}
	if req.IsPerishable != nil {
		product.IsPerishable = *req.IsPerishable
	}
	if req.Notes != nil {
		product.Notes = req.Notes
	}

	err = h.repo.Update(ctx, product)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update product"})
		return
	}

	response := dtos.ProductResponse{
		ID:                product.ID,
		SKU:               product.SKU,
		Name:              product.Name,
		Description:       product.Description,
		CategoryID:        product.CategoryID,
		BrandID:           product.BrandID,
		VolumeML:          product.VolumeML,
		WeightKG:          product.WeightKG,
		DimensionsCM:      product.DimensionsCM,
		StandardCost:      product.StandardCost,
		StandardPrice:     product.StandardPrice,
		MarkupPercentage:  product.MarkupPercentage,
		ReorderPoint:      product.ReorderPoint,
		PrimarySupplierID: product.PrimarySupplierID,
		SupplierSKU:       product.SupplierSKU,
		IsActive:          product.IsActive,
		IsPerishable:      product.IsPerishable,
		Notes:             product.Notes,
		CreatedAt:         product.CreatedAt,
		UpdatedAt:         product.UpdatedAt,
	}

	c.JSON(http.StatusOK, response)
}

// DELETE /products/:id - Delete product
func (h *productHandler) HandleDeleteProduct(c *gin.Context) {
	id := c.Param("id")
	productID, err := uuid.Parse(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid UUID format"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	err = h.repo.Delete(ctx, productID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete product"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Product deleted successfully"})
}

func BuildRoutes(rg *gin.RouterGroup, db *database.DB) {
	handler := NewHandler(db)

	rg.GET("", handler.HandleGetProducts)                                         // GET /products
	rg.GET("/:id", handler.HandleGetProduct)                                      // GET /products/:id
	rg.GET("/category/:categoryId", handler.HandleGetProductsByCategory)          // GET /products/category/:categoryId
	rg.GET("/category/:categoryId/tree", handler.HandleGetProductsByCategoryTree) // GET /products/category/:categoryId/tree
	rg.POST("", handler.HandleCreateProduct)                                      // POST /products
	rg.PUT("/:id", handler.HandleUpdateProduct)                                   // PUT /products/:id
	rg.DELETE("/:id", handler.HandleDeleteProduct)                                // DELETE /products/:id
}
