-- Add unique constraint to brands table
ALTER TABLE brands ADD CONSTRAINT brands_name_unique UNIQUE (name);

-- Add index for faster lookups
CREATE INDEX idx_brands_name ON brands(name);
