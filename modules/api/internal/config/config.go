package config

import "os"

type Config struct {
	DatabaseURL    tring
	Port          string
	ClerkSecretKeystring
}

func Load() *Config {
	return &Config{
		DatabaseURL:    getEnv("DATABASE_URL", ""),
		Port:           getEnv("PORT", "8080"),
		ClerkSecretKey: getEnv("CLERK_SECRET_KEY", ""),
	}
}

func getEnv(envValue string, defaultValue string) string {
	if value := os.Getenv(envValue); value != "" {
		return value
	}
	return defaultValue
}
