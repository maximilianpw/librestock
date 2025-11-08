package products

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/google/uuid"

	"github.com/maximilianpw/rbi-inventory/internal/handlers/products/dtos"
	"github.com/maximilianpw/rbi-inventory/internal/models"
	"github.com/maximilianpw/rbi-inventory/internal/repository/products"
)

// NotFoundError represents a domain error for resources not found
type NotFoundError struct {
	Resource string
}

func (e *NotFoundError) Error() string {
	return e.Resource + " not found"
}

type ProductService interface {
	Create(ctx context.Context, req dtos.CreateProductRequest) (*models.Product, error)
	GetByID(ctx context.Context, id uuid.UUID) (*models.Product, error)
	List(ctx context.Context) ([]*models.Product, error)
	GetByCategory(ctx context.Context, categoryID uuid.UUID) ([]*models.Product, error)
	GetByCategoryWithChildren(ctx context.Context, categoryID uuid.UUID) ([]*models.Product, error)
	Update(ctx context.Context, id uuid.UUID, req dtos.UpdateProductRequest) (*models.Product, error)
	Delete(ctx context.Context, id uuid.UUID) error
}

type productService struct {
	repo products.ProductRepository
}

func NewService(repo products.ProductRepository) ProductService {
	return &productService{repo: repo}
}

func (s *productService) Create(ctx context.Context, req dtos.CreateProductRequest) (*models.Product, error) {
	// Business validation
	if req.SKU == "" {
		return nil, errors.New("SKU is required")
	}
	if req.Name == "" {
		return nil, errors.New("name is required")
	}

	product := req.ToModel()
	product.ID = uuid.New()
	product.CreatedAt = time.Now()
	product.UpdatedAt = time.Now()

	err := s.repo.Create(ctx, product)
	if err != nil {
		return nil, err
	}

	return product, nil
}

func (s *productService) GetByID(ctx context.Context, id uuid.UUID) (*models.Product, error) {
	product, err := s.repo.GetByID(ctx, id)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, &NotFoundError{Resource: "Product"}
		}
		return nil, err
	}
	return product, nil
}

func (s *productService) List(ctx context.Context) ([]*models.Product, error) {
	return s.repo.List(ctx)
}

func (s *productService) GetByCategory(ctx context.Context, categoryID uuid.UUID) ([]*models.Product, error) {
	return s.repo.GetByCategory(ctx, categoryID)
}

func (s *productService) GetByCategoryWithChildren(ctx context.Context, categoryID uuid.UUID) ([]*models.Product, error) {
	return s.repo.GetByCategoryWithChildren(ctx, categoryID)
}

func (s *productService) Update(ctx context.Context, id uuid.UUID, req dtos.UpdateProductRequest) (*models.Product, error) {
	product, err := s.repo.GetByID(ctx, id)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, &NotFoundError{Resource: "Product"}
		}
		return nil, err
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

	product.UpdatedAt = time.Now()

	err = s.repo.Update(ctx, product)
	if err != nil {
		return nil, err
	}

	return product, nil
}

func (s *productService) Delete(ctx context.Context, id uuid.UUID) error {
	return s.repo.Delete(ctx, id)
}
