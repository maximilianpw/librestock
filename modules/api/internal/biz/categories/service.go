package categories

import (
	"context"
	"database/sql"
	"time"

	"github.com/google/uuid"

	"github.com/maximilianpw/rbi-inventory/internal/handlers/categories/dtos"
	"github.com/maximilianpw/rbi-inventory/internal/models"
	"github.com/maximilianpw/rbi-inventory/internal/repository/categories"
)

// NotFoundError represents a domain error for resources not found
type NotFoundError struct {
	Resource string
}

func (e *NotFoundError) Error() string {
	return e.Resource + " not found"
}

type CategoryService interface {
	List(ctx context.Context) ([]*models.Category, error)
	GetChildren(ctx context.Context, parentID uuid.UUID) ([]*models.Category, error)
	Create(ctx context.Context, req dtos.CreateCategoryRequest) (*models.Category, error)
	GetByID(ctx context.Context, id uuid.UUID) (*models.Category, error)
	Update(ctx context.Context, id uuid.UUID, req dtos.UpdateCategoryRequest) (*models.Category, error)
	Delete(ctx context.Context, id uuid.UUID) error
}

type categoryService struct {
	repo categories.CategoryRepository
}

func NewService(repo categories.CategoryRepository) CategoryService {
	return &categoryService{repo: repo}
}

func (s *categoryService) List(ctx context.Context) ([]*models.Category, error) {
	return s.repo.List(ctx)
}

func (s *categoryService) GetChildren(ctx context.Context, parentID uuid.UUID) ([]*models.Category, error) {
	return s.repo.GetChildren(ctx, parentID)
}

func (s *categoryService) Create(ctx context.Context, req dtos.CreateCategoryRequest) (*models.Category, error) {
	category := req.ToModel()
	category.ID = uuid.New()
	category.CreatedAt = time.Now()
	category.UpdatedAt = time.Now()

	err := s.repo.Create(ctx, category)
	if err != nil {
		return nil, err
	}

	return category, nil
}

func (s *categoryService) GetByID(ctx context.Context, id uuid.UUID) (*models.Category, error) {
	category, err := s.repo.GetByID(ctx, id)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, &NotFoundError{Resource: "Category"}
		}
		return nil, err
	}
	return category, nil
}

func (s *categoryService) Update(ctx context.Context, id uuid.UUID, req dtos.UpdateCategoryRequest) (*models.Category, error) {
	category, err := s.repo.GetByID(ctx, id)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, &NotFoundError{Resource: "Category"}
		}
		return nil, err
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

	category.UpdatedAt = time.Now()

	err = s.repo.Update(ctx, category)
	if err != nil {
		return nil, err
	}

	return category, nil
}

func (s *categoryService) Delete(ctx context.Context, id uuid.UUID) error {
	return s.repo.Delete(ctx, id)
}
