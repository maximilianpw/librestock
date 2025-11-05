-- Remove index and unique constraint from brands table
DROP INDEX IF EXISTS idx_brands_name;
ALTER TABLE brands DROP CONSTRAINT IF EXISTS brands_name_unique;
