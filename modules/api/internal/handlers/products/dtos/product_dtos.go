package dtos

import (
	"time"

	"github.com/google/uuid"
	"github.com/maximilianpw/rbi-inventory/internal/models"
)

type ProductResponse struct {
	ID                   uuid.UUID  `json:"id"`
	SKU                  string     `json:"sku"`
	Name                 string     `json:"name"`
	Description          *string    `json:"description,omitempty"`
	CategoryID           uuid.UUID  `json:"category_id"`
	BrandID              *uuid.UUID `json:"brand_id,omitempty"`
	VolumeML             *int       `json:"volume_ml,omitempty"`
	WeightKG             *float64   `json:"weight_kg,omitempty"`
	DimensionsCM         *string    `json:"dimensions_cm,omitempty"`
	StandardCost         *float64   `json:"standard_cost,omitempty"`
	StandardPrice        *float64   `json:"standard_price,omitempty"`
	MarkupPercentage     *float64   `json:"markup_percentage,omitempty"`
	ReorderPoint         int        `json:"reorder_point"`
	PrimarySupplierID    *uuid.UUID `json:"primary_supplier_id,omitempty"`
	SupplierSKU          *string    `json:"supplier_sku,omitempty"`
	IsActive             bool       `json:"is_active"`
	IsPerishable         bool       `json:"is_perishable"`
	Notes                *string    `json:"notes,omitempty"`
	CreatedAt            time.Time  `json:"created_at"`
	UpdatedAt            time.Time  `json:"updated_at"`
}

type CreateProductRequest struct {
	SKU                  string     `json:"sku" binding:"required,min=1,max=50"`
	Name                 string     `json:"name" binding:"required,min=1,max=200"`
	Description          *string    `json:"description,omitempty" binding:"omitempty,max=1000"`
	CategoryID           uuid.UUID  `json:"category_id" binding:"required"`
	BrandID              *uuid.UUID `json:"brand_id,omitempty"`
	VolumeML             *int       `json:"volume_ml,omitempty" binding:"omitempty,min=1"`
	WeightKG             *float64   `json:"weight_kg,omitempty" binding:"omitempty,min=0"`
	DimensionsCM         *string    `json:"dimensions_cm,omitempty" binding:"omitempty,max=50"`
	StandardCost         *float64   `json:"standard_cost,omitempty" binding:"omitempty,min=0"`
	StandardPrice        *float64   `json:"standard_price,omitempty" binding:"omitempty,min=0"`
	MarkupPercentage     *float64   `json:"markup_percentage,omitempty" binding:"omitempty,min=0,max=1000"`
	ReorderPoint         int        `json:"reorder_point" binding:"min=0"`
	PrimarySupplierID    *uuid.UUID `json:"primary_supplier_id,omitempty"`
	SupplierSKU          *string    `json:"supplier_sku,omitempty" binding:"omitempty,max=50"`
	IsActive             bool       `json:"is_active"`
	IsPerishable         bool       `json:"is_perishable"`
	Notes                *string    `json:"notes,omitempty" binding:"omitempty,max=500"`
}

func (r *CreateProductRequest) ToModel() *models.Product {
	return &models.Product{
		ID:                uuid.New(),
		SKU:               r.SKU,
		Name:              r.Name,
		Description:       r.Description,
		CategoryID:        r.CategoryID,
		BrandID:           r.BrandID,
		VolumeML:          r.VolumeML,
		WeightKG:          r.WeightKG,
		DimensionsCM:      r.DimensionsCM,
		StandardCost:      r.StandardCost,
		StandardPrice:     r.StandardPrice,
		MarkupPercentage:  r.MarkupPercentage,
		ReorderPoint:      r.ReorderPoint,
		PrimarySupplierID: r.PrimarySupplierID,
		SupplierSKU:       r.SupplierSKU,
		IsActive:          r.IsActive,
		IsPerishable:      r.IsPerishable,
		Notes:             r.Notes,
	}
}

type UpdateProductRequest struct {
	SKU                  *string    `json:"sku,omitempty" binding:"omitempty,min=1,max=50"`
	Name                 *string    `json:"name,omitempty" binding:"omitempty,min=1,max=200"`
	Description          *string    `json:"description,omitempty" binding:"omitempty,max=1000"`
	CategoryID           *uuid.UUID `json:"category_id,omitempty"`
	BrandID              *uuid.UUID `json:"brand_id,omitempty"`
	VolumeML             *int       `json:"volume_ml,omitempty" binding:"omitempty,min=1"`
	WeightKG             *float64   `json:"weight_kg,omitempty" binding:"omitempty,min=0"`
	DimensionsCM         *string    `json:"dimensions_cm,omitempty" binding:"omitempty,max=50"`
	StandardCost         *float64   `json:"standard_cost,omitempty" binding:"omitempty,min=0"`
	StandardPrice        *float64   `json:"standard_price,omitempty" binding:"omitempty,min=0"`
	MarkupPercentage     *float64   `json:"markup_percentage,omitempty" binding:"omitempty,min=0,max=1000"`
	ReorderPoint         *int       `json:"reorder_point,omitempty" binding:"omitempty,min=0"`
	PrimarySupplierID    *uuid.UUID `json:"primary_supplier_id,omitempty"`
	SupplierSKU          *string    `json:"supplier_sku,omitempty" binding:"omitempty,max=50"`
	IsActive             *bool      `json:"is_active,omitempty"`
	IsPerishable         *bool      `json:"is_perishable,omitempty"`
	Notes                *string    `json:"notes,omitempty" binding:"omitempty,max=500"`
}
