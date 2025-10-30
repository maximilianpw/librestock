package auth

import (
	"context"
	"net/http"

	"github.com/clerk/clerk-sdk-go/v2"
	clerkuser "github.com/clerk/clerk-sdk-go/v2/user"
	"github.com/gin-gonic/gin"

	"github.com/maximilianpw/rbi-inventory/internal/config"
	"github.com/maximilianpw/rbi-inventory/internal/database"
)

type authHandler struct {
	config *config.Config
}

func newAuthHandler(cfg *config.Config) *authHandler {
	// Set the Clerk secret key
	clerk.SetKey(cfg.ClerkSecretKey)
	return &authHandler{
		config: cfg,
	}
}

// GetUserProfile returns the authenticated user's profile from Clerk
func (h *authHandler) handleGetProfile(c *gin.Context) {
	// Get the user ID from the Gin context (set by auth middleware)
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	// Get the user profile from Clerk
	user, err := clerkuser.Get(context.Background(), userID.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch user profile"})
		return
	}

	c.JSON(http.StatusOK, user)
}

// GetSessionClaims returns the session claims from the current request
func (h *authHandler) handleGetSessionClaims(c *gin.Context) {
	// Extract claims from Gin context (set by auth middleware)
	claims, exists := c.Get("clerk_claims")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "no session claims found"})
		return
	}

	sessionClaims, ok := claims.(*clerk.SessionClaims)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "invalid session claims"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user_id":    sessionClaims.Subject,
		"session_id": sessionClaims.SessionID,
		"expires_at": sessionClaims.Expiry,
		"issued_at":  sessionClaims.IssuedAt,
	})
}

func BuildRoutes(rg *gin.RouterGroup, db *database.DB, cfg *config.Config) {
	handler := newAuthHandler(cfg)

	// These routes require authentication (should be protected by auth middleware)
	rg.GET("/profile", handler.handleGetProfile)
	rg.GET("/session", handler.handleGetSessionClaims)
}
