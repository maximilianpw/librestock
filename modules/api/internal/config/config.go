package config

import "os"

type Config struct {
	DatabaseURL     string
	Port            string
	ClerkSecretKey  string
}

func Load() *Config {
	return &Config{
		DatabaseURL:    getEnv("DATABASE_URL", ""),
		Port:           getEnv("PORT", "5432"),
		ClerkSecretKey: getEnv("CLERK_SECRET_KEY", ""),
	}
}

func getEnv(envValue string, defaultValue string) string {
	if value := os.Getenv(envValue); value != "" {
		return value
	}
	return defaultValue
}
