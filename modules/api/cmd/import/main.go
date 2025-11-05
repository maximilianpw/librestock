package main

import (
	"context"
	"encoding/csv"
	"log"
	"os"
	"strconv"
	"strings"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"

	"github.com/maximilianpw/rbi-inventory/internal/config"
	"github.com/maximilianpw/rbi-inventory/internal/models"
)

func main() {
	if len(os.Args) < 2 {
		log.Fatal("Usage: go run main.go <path-to-sortly.csv>")
	}

	filePath := os.Args[1]

	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, using environment variables")
	}

	cfg := config.Load()

	db, err := sqlx.Open("postgres", cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatalf("Failed to ping database: %v", err)
	}

	log.Println("Connected to database successfully")

	file, err := os.Open(filePath)
	if err != nil {
		log.Fatalf("Failed to open file: %v", err)
	}
	defer file.Close()

	reader := csv.NewReader(file)
	records, err := reader.ReadAll()
	if err != nil {
		log.Fatalf("Failed to read CSV: %v", err)
	}

	if len(records) < 2 {
		log.Fatal("CSV file is empty or has no data rows")
	}

	log.Printf("Read %d records from CSV\n", len(records)-1)

	items := parseCSV(records)
	log.Printf("Parsed %d unique items from %d transactions\n", len(items), len(records)-1)

	ctx := context.Background()
	if err := importData(ctx, db, items); err != nil {
		log.Fatalf("Failed to import data: %v", err)
	}

	log.Println("Import completed successfully")
}

func parseCSV(records [][]string) map[string]*models.SortlyItem {
	header := records[0]
	items := make(map[string]*models.SortlyItem)

	for i := 1; i < len(records); i++ {
		row := records[i]
		if len(row) != len(header) {
			continue
		}

		item := &models.SortlyItem{}
		for j, col := range header {
			value := row[j]
			switch col {
			case "Entry Name":
				item.EntryName = value
			case "Variant Details":
				item.VariantDetails = value
			case "Sortly ID (SID)":
				item.SortlyID = value
			case "Unit":
				item.Unit = value
			case "Min Level":
				item.MinLevel = value
			case "Price":
				item.Price = value
			case "Value":
				item.Value = value
			case "Notes":
				item.Notes = value
			case "Tags":
				item.Tags = value
			case "Barcode/QR1-Data":
				item.BarcodeQR1Data = value
			case "Barcode/QR1-Type":
				item.BarcodeQR1Type = value
			case "Barcode/QR2-Data":
				item.BarcodeQR2Data = value
			case "Barcode/QR2-Type":
				item.BarcodeQR2Type = value
			case "Transaction Date (CEST)":
				item.TransactionDate = value
			case "Transaction Type":
				item.TransactionType = value
			case "QTY change (Quantity Delta)":
				item.QtyChange = value
			case "New QTY":
				item.NewQty = value
			case "Folder":
				item.Folder = value
			case "Folder SID":
				item.FolderSID = value
			case "User":
				item.User = value
			case "Transaction Note":
				item.TransactionNote = value
			case "Location":
				item.Location = value
			case "Expiry Date":
				item.ExpiryDate = value
			}
		}

		if item.SortlyID != "" && item.NewQty != "" {
			items[item.SortlyID] = item
		}
	}

	return items
}

func importData(ctx context.Context, db *sqlx.DB, items map[string]*models.SortlyItem) error {
	folderMap := make(map[string]uuid.UUID)
	brandMap := make(map[string]uuid.UUID)

	existingBrands, err := getExistingBrands(ctx, db)
	if err != nil {
		log.Printf("Warning: Failed to fetch existing brands: %v", err)
		existingBrands = make(map[string]uuid.UUID)
	}
	log.Printf("Found %d existing brands in database", len(existingBrands))

	log.Println("Creating categories and brands...")
	for _, item := range items {
		if item.Folder == "" {
			continue
		}

		if _, exists := folderMap[item.Folder]; !exists {
			categoryID := uuid.New()
			if err := createCategory(ctx, db, categoryID, item.Folder); err != nil {
				log.Printf("Warning: Failed to create category %s: %v", item.Folder, err)
			} else {
				folderMap[item.Folder] = categoryID
				log.Printf("Created category: %s", item.Folder)
			}

			if existingID, exists := existingBrands[item.Folder]; exists {
				brandMap[item.Folder] = existingID
				log.Printf("Using existing brand: %s", item.Folder)
			} else {
				brandID := uuid.New()
				if err := createBrand(ctx, db, brandID, item.Folder); err != nil {
					log.Printf("Warning: Failed to create brand %s: %v", item.Folder, err)
				} else {
					brandMap[item.Folder] = brandID
					log.Printf("Created brand: %s", item.Folder)
				}
			}
		}
	}

	log.Println("Creating products...")
	created := 0
	for _, item := range items {
		if item.Folder == "" {
			log.Printf("Skipping item %s - no folder", item.EntryName)
			continue
		}

		categoryID, ok := folderMap[item.Folder]
		if !ok {
			log.Printf("Skipping item %s - category not found for folder %s", item.EntryName, item.Folder)
			continue
		}

		var brandID *uuid.UUID
		if id, exists := brandMap[item.Folder]; exists {
			brandID = &id
		}

		product := convertToProduct(item, categoryID, brandID)
		if err := createProduct(ctx, db, product); err != nil {
			log.Printf("Warning: Failed to create product %s: %v", item.EntryName, err)
		} else {
			created++
			if created%50 == 0 {
				log.Printf("Created %d products...", created)
			}
		}
	}

	log.Printf("Successfully created %d products", created)
	return nil
}

func getExistingBrands(ctx context.Context, db *sqlx.DB) (map[string]uuid.UUID, error) {
	query := `SELECT id, name FROM brands`
	rows, err := db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	brands := make(map[string]uuid.UUID)
	for rows.Next() {
		var id uuid.UUID
		var name string
		if err := rows.Scan(&id, &name); err != nil {
			return nil, err
		}
		brands[name] = id
	}

	return brands, rows.Err()
}

func createCategory(ctx context.Context, db *sqlx.DB, id uuid.UUID, name string) error {
	query := `
		INSERT INTO categories (id, name, parent_id, description, created_at, updated_at)
		VALUES ($1, $2, NULL, NULL, NOW(), NOW())
		ON CONFLICT DO NOTHING
	`
	_, err := db.ExecContext(ctx, query, id, name)
	return err
}

func createBrand(ctx context.Context, db *sqlx.DB, id uuid.UUID, name string) error {
	query := `
		INSERT INTO brands (id, name, description, website, created_at, updated_at)
		VALUES ($1, $2, NULL, NULL, NOW(), NOW())
		ON CONFLICT (name) DO NOTHING
	`
	_, err := db.ExecContext(ctx, query, id, name)
	return err
}

func createProduct(ctx context.Context, db *sqlx.DB, product *models.Product) error {
	query := `
		INSERT INTO product_catalog (
			id, sku, name, description, category_id, brand_id, volume_ml,
			weight_kg, dimensions_cm, standard_cost, standard_price,
			markup_percentage, reorder_point, primary_supplier_id,
			supplier_sku, is_active, is_perishable, notes, created_at, updated_at
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
			$16, $17, $18, NOW(), NOW()
		)
		ON CONFLICT (sku) DO UPDATE SET
			name = EXCLUDED.name,
			description = EXCLUDED.description,
			category_id = EXCLUDED.category_id,
			brand_id = EXCLUDED.brand_id,
			volume_ml = EXCLUDED.volume_ml,
			standard_cost = EXCLUDED.standard_cost,
			standard_price = EXCLUDED.standard_price,
			reorder_point = EXCLUDED.reorder_point,
			notes = EXCLUDED.notes,
			updated_at = NOW()
	`
	_, err := db.ExecContext(ctx, query,
		product.ID, product.SKU, product.Name, product.Description,
		product.CategoryID, product.BrandID, product.VolumeML,
		product.WeightKG, product.DimensionsCM, product.StandardCost,
		product.StandardPrice, product.MarkupPercentage, product.ReorderPoint,
		product.PrimarySupplierID, product.SupplierSKU, product.IsActive,
		product.IsPerishable, product.Notes,
	)
	return err
}

func convertToProduct(item *models.SortlyItem, categoryID uuid.UUID, brandID *uuid.UUID) *models.Product {
	product := &models.Product{
		ID:         uuid.New(),
		SKU:        item.SortlyID,
		Name:       item.EntryName,
		CategoryID: categoryID,
		BrandID:    brandID,
		IsActive:   true,
	}

	if item.Notes != "" {
		product.Description = &item.Notes
		product.Notes = &item.Notes
	}

	if price, err := strconv.ParseFloat(item.Price, 64); err == nil && price > 0 {
		product.StandardCost = &price
	}

	if minLevel, err := strconv.Atoi(item.MinLevel); err == nil && minLevel > 0 {
		product.ReorderPoint = minLevel
	}

	volumeML := extractVolumeML(item.EntryName, item.VariantDetails)
	if volumeML > 0 {
		product.VolumeML = &volumeML
	}

	if item.ExpiryDate != "" {
		product.IsPerishable = true
	}

	return product
}

func extractVolumeML(name, variant string) int {
	text := name + " " + variant
	text = strings.ToLower(text)

	patterns := []struct {
		suffix     string
		multiplier int
	}{
		{"ml", 1},
		{"mL", 1},
		{"oz", 30},
		{"fl oz", 30},
	}

	for _, pattern := range patterns {
		idx := strings.Index(text, pattern.suffix)
		if idx > 0 {
			var num strings.Builder
			for i := idx - 1; i >= 0; i-- {
				ch := text[i]
				if (ch >= '0' && ch <= '9') || ch == '.' {
					num.WriteByte(ch)
				} else if ch == ' ' {
					continue
				} else {
					break
				}
			}

			numStr := reverse(num.String())
			if val, err := strconv.ParseFloat(numStr, 64); err == nil {
				return int(val * float64(pattern.multiplier))
			}
		}
	}

	return 0
}

func reverse(s string) string {
	runes := []rune(s)
	for i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {
		runes[i], runes[j] = runes[j], runes[i]
	}
	return string(runes)
}
