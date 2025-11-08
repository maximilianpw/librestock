package products

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	bizproducts "github.com/maximilianpw/rbi-inventory/internal/biz/products"
	"github.com/maximilianpw/rbi-inventory/internal/database"
	"github.com/maximilianpw/rbi-inventory/internal/handlers/products/dtos"
	"github.com/maximilianpw/rbi-inventory/internal/repository/products"
)

type productHandler struct {
	service bizproducts.ProductService
}

func NewHandler(db *database.DB) *productHandler {
	productRepo := products.NewRepository(db.DB)
	productService := bizproducts.NewService(productRepo)
	return &productHandler{service: productService}
}

// GET /products - List all products
func (h *productHandler) HandleGetProducts(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	products, err := h.service.List(ctx)
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

	product, err := h.service.GetByID(ctx, productID)
	if err != nil {
		if _, ok := err.(*bizproducts.NotFoundError); ok {
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

	products, err := h.service.GetByCategory(ctx, categoryID)
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

	products, err := h.service.GetByCategoryWithChildren(ctx, categoryID)
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

	product, err := h.service.Create(ctx, req)
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

	product, err := h.service.Update(ctx, productID, req)
	if err != nil {
		if _, ok := err.(*bizproducts.NotFoundError); ok {
			c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
			return
		}
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

	err = h.service.Delete(ctx, productID)
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
