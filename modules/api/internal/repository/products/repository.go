package products

import (
	"context"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"github.com/maximilianpw/rbi-inventory/internal/models"
)

type ProductRepository interface {
	Create(ctx context.Context, product *models.Product) error
	GetByID(ctx context.Context, id uuid.UUID) (*models.Product, error)
	List(ctx context.Context) ([]*models.Product, error)
	GetByCategory(ctx context.Context, categoryID uuid.UUID) ([]*models.Product, error)
	GetByCategoryWithChildren(ctx context.Context, categoryID uuid.UUID) ([]*models.Product, error)
	Update(ctx context.Context, product *models.Product) error
	Delete(ctx context.Context, id uuid.UUID) error
}

type productRepository struct {
	db *sqlx.DB
}

func NewRepository(db *sqlx.DB) ProductRepository {
	return &productRepository{db: db}
}

func (r *productRepository) Create(ctx context.Context, product *models.Product) error {
	query := `
		INSERT INTO product_catalog (
			id, sku, name, description, category_id, brand_id, volume_ml,
			weight_kg, dimensions_cm, standard_cost, standard_price,
			markup_percentage, reorder_point, primary_supplier_id,
			supplier_sku, is_active, is_perishable, notes, created_at, updated_at
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
			$16, $17, $18, NOW(), NOW()
		)`
	_, err := r.db.ExecContext(ctx, query,
		product.ID, product.SKU, product.Name, product.Description,
		product.CategoryID, product.BrandID, product.VolumeML,
		product.WeightKG, product.DimensionsCM, product.StandardCost,
		product.StandardPrice, product.MarkupPercentage, product.ReorderPoint,
		product.PrimarySupplierID, product.SupplierSKU, product.IsActive,
		product.IsPerishable, product.Notes,
	)
	return err
}

func (r *productRepository) GetByID(ctx context.Context, id uuid.UUID) (*models.Product, error) {
	query := `
		SELECT id, sku, name, description, category_id, brand_id, volume_ml,
			   weight_kg, dimensions_cm, standard_cost, standard_price,
			   markup_percentage, reorder_point, primary_supplier_id,
			   supplier_sku, is_active, is_perishable, notes, created_at, updated_at
		FROM product_catalog
		WHERE id = $1`
	var product models.Product
	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&product.ID, &product.SKU, &product.Name, &product.Description,
		&product.CategoryID, &product.BrandID, &product.VolumeML,
		&product.WeightKG, &product.DimensionsCM, &product.StandardCost,
		&product.StandardPrice, &product.MarkupPercentage, &product.ReorderPoint,
		&product.PrimarySupplierID, &product.SupplierSKU, &product.IsActive,
		&product.IsPerishable, &product.Notes, &product.CreatedAt, &product.UpdatedAt,
	)
	return &product, err
}

func (r *productRepository) List(ctx context.Context) ([]*models.Product, error) {
	query := `
		SELECT id, sku, name, description, category_id, brand_id, volume_ml,
			   weight_kg, dimensions_cm, standard_cost, standard_price,
			   markup_percentage, reorder_point, primary_supplier_id,
			   supplier_sku, is_active, is_perishable, notes, created_at, updated_at
		FROM product_catalog
		ORDER BY name`
	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var products []*models.Product
	for rows.Next() {
		var product models.Product
		err := rows.Scan(
			&product.ID, &product.SKU, &product.Name, &product.Description,
			&product.CategoryID, &product.BrandID, &product.VolumeML,
			&product.WeightKG, &product.DimensionsCM, &product.StandardCost,
			&product.StandardPrice, &product.MarkupPercentage, &product.ReorderPoint,
			&product.PrimarySupplierID, &product.SupplierSKU, &product.IsActive,
			&product.IsPerishable, &product.Notes, &product.CreatedAt, &product.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		products = append(products, &product)
	}
	return products, rows.Err()
}

func (r *productRepository) GetByCategory(ctx context.Context, categoryID uuid.UUID) ([]*models.Product, error) {
	query := `
		SELECT id, sku, name, description, category_id, brand_id, volume_ml,
			   weight_kg, dimensions_cm, standard_cost, standard_price,
			   markup_percentage, reorder_point, primary_supplier_id,
			   supplier_sku, is_active, is_perishable, notes, created_at, updated_at
		FROM product_catalog
		WHERE category_id = $1
		ORDER BY name`
	rows, err := r.db.QueryContext(ctx, query, categoryID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var products []*models.Product
	for rows.Next() {
		var product models.Product
		err := rows.Scan(
			&product.ID, &product.SKU, &product.Name, &product.Description,
			&product.CategoryID, &product.BrandID, &product.VolumeML,
			&product.WeightKG, &product.DimensionsCM, &product.StandardCost,
			&product.StandardPrice, &product.MarkupPercentage, &product.ReorderPoint,
			&product.PrimarySupplierID, &product.SupplierSKU, &product.IsActive,
			&product.IsPerishable, &product.Notes, &product.CreatedAt, &product.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		products = append(products, &product)
	}
	return products, rows.Err()
}

func (r *productRepository) GetByCategoryWithChildren(ctx context.Context, categoryID uuid.UUID) ([]*models.Product, error) {
	query := `
		WITH RECURSIVE category_tree AS (
			-- Start with the given category
			SELECT id FROM categories WHERE id = $1
			UNION ALL
			-- Recursively get all children
			SELECT c.id
			FROM categories c
			JOIN category_tree ct ON c.parent_id = ct.id
		)
		SELECT p.id, p.sku, p.name, p.description, p.category_id, p.brand_id, p.volume_ml,
			   p.weight_kg, p.dimensions_cm, p.standard_cost, p.standard_price,
			   p.markup_percentage, p.reorder_point, p.primary_supplier_id,
			   p.supplier_sku, p.is_active, p.is_perishable, p.notes, p.created_at, p.updated_at
		FROM product_catalog p
		WHERE p.category_id IN (SELECT id FROM category_tree)
		ORDER BY p.name`
	rows, err := r.db.QueryContext(ctx, query, categoryID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var products []*models.Product
	for rows.Next() {
		var product models.Product
		err := rows.Scan(
			&product.ID, &product.SKU, &product.Name, &product.Description,
			&product.CategoryID, &product.BrandID, &product.VolumeML,
			&product.WeightKG, &product.DimensionsCM, &product.StandardCost,
			&product.StandardPrice, &product.MarkupPercentage, &product.ReorderPoint,
			&product.PrimarySupplierID, &product.SupplierSKU, &product.IsActive,
			&product.IsPerishable, &product.Notes, &product.CreatedAt, &product.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		products = append(products, &product)
	}
	return products, rows.Err()
}

func (r *productRepository) Update(ctx context.Context, product *models.Product) error {
	query := `
		UPDATE product_catalog
		SET sku = $1, name = $2, description = $3, category_id = $4, brand_id = $5,
			volume_ml = $6, weight_kg = $7, dimensions_cm = $8, standard_cost = $9,
			standard_price = $10, markup_percentage = $11, reorder_point = $12,
			primary_supplier_id = $13, supplier_sku = $14, is_active = $15,
			is_perishable = $16, notes = $17, updated_at = NOW()
		WHERE id = $18`
	_, err := r.db.ExecContext(ctx, query,
		product.SKU, product.Name, product.Description, product.CategoryID,
		product.BrandID, product.VolumeML, product.WeightKG, product.DimensionsCM,
		product.StandardCost, product.StandardPrice, product.MarkupPercentage,
		product.ReorderPoint, product.PrimarySupplierID, product.SupplierSKU,
		product.IsActive, product.IsPerishable, product.Notes, product.ID,
	)
	return err
}

func (r *productRepository) Delete(ctx context.Context, id uuid.UUID) error {
	query := `DELETE FROM product_catalog WHERE id = $1`
	_, err := r.db.ExecContext(ctx, query, id)
	return err
}
