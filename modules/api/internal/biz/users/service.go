package users

import (
	"context"
	"database/sql"
	"time"

	"github.com/google/uuid"

	"github.com/maximilianpw/rbi-inventory/internal/handlers/users/dtos"
	"github.com/maximilianpw/rbi-inventory/internal/models"
	"github.com/maximilianpw/rbi-inventory/internal/repository/users"
)

// NotFoundError represents a domain error for resources not found
type NotFoundError struct {
	Resource string
}

func (e *NotFoundError) Error() string {
	return e.Resource + " not found"
}

// ConflictError represents a domain error for resource conflicts
type ConflictError struct {
	Message string
}

func (e *ConflictError) Error() string {
	return e.Message
}

type UserService interface {
	GetByID(ctx context.Context, id uuid.UUID) (*models.User, error)
	List(ctx context.Context, filters map[string]interface{}) ([]*models.User, error)
	Create(ctx context.Context, req dtos.CreateUserRequest) (*models.User, error)
	Update(ctx context.Context, id uuid.UUID, req dtos.UpdateUserRequest) (*models.User, error)
	Delete(ctx context.Context, id uuid.UUID) error
	Deactivate(ctx context.Context, id uuid.UUID) (*models.User, error)
	Activate(ctx context.Context, id uuid.UUID) (*models.User, error)
	SearchByName(ctx context.Context, query string) ([]*models.User, error)
}

type userService struct {
	repo users.UserRepository
}

func NewService(repo users.UserRepository) UserService {
	return &userService{repo: repo}
}

func (s *userService) GetByID(ctx context.Context, id uuid.UUID) (*models.User, error) {
	user, err := s.repo.GetByID(ctx, id)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, &NotFoundError{Resource: "User"}
		}
		return nil, err
	}
	return user, nil
}

func (s *userService) List(ctx context.Context, filters map[string]interface{}) ([]*models.User, error) {
	return s.repo.List(ctx, filters)
}

func (s *userService) Create(ctx context.Context, req dtos.CreateUserRequest) (*models.User, error) {
	// Check if email already exists
	existingUser, _ := s.repo.GetByEmail(ctx, req.Email)
	if existingUser != nil {
		return nil, &ConflictError{Message: "User with this email already exists"}
	}

	user := req.ToModel()
	user.ID = uuid.New()
	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()

	err := s.repo.Create(ctx, user)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (s *userService) Update(ctx context.Context, id uuid.UUID, req dtos.UpdateUserRequest) (*models.User, error) {
	user, err := s.repo.GetByID(ctx, id)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, &NotFoundError{Resource: "User"}
		}
		return nil, err
	}

	if req.Name != nil {
		user.Name = *req.Name
	}
	if req.Email != nil {
		// Check if new email already exists (and it's not the same user)
		existingUser, _ := s.repo.GetByEmail(ctx, *req.Email)
		if existingUser != nil && existingUser.ID != id {
			return nil, &ConflictError{Message: "Email already in use"}
		}
		user.Email = *req.Email
	}
	if req.Role != nil {
		user.Role = *req.Role
	}
	if req.IsActive != nil {
		user.IsActive = *req.IsActive
	}

	user.UpdatedAt = time.Now()

	err = s.repo.Update(ctx, user)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (s *userService) Delete(ctx context.Context, id uuid.UUID) error {
	return s.repo.Delete(ctx, id)
}

func (s *userService) Deactivate(ctx context.Context, id uuid.UUID) (*models.User, error) {
	user, err := s.repo.GetByID(ctx, id)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, &NotFoundError{Resource: "User"}
		}
		return nil, err
	}

	user.IsActive = false
	user.UpdatedAt = time.Now()

	err = s.repo.Update(ctx, user)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (s *userService) Activate(ctx context.Context, id uuid.UUID) (*models.User, error) {
	user, err := s.repo.GetByID(ctx, id)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, &NotFoundError{Resource: "User"}
		}
		return nil, err
	}

	user.IsActive = true
	user.UpdatedAt = time.Now()

	err = s.repo.Update(ctx, user)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (s *userService) SearchByName(ctx context.Context, query string) ([]*models.User, error) {
	return s.repo.SearchByName(ctx, query)
}
