package middleware

import (
	"net/http"

	"github.com/clerk/clerk-sdk-go/v2"
	clerkhttp "github.com/clerk/clerk-sdk-go/v2/http"
	"github.com/gin-gonic/gin"

	"github.com/maximilianpw/rbi-inventory/internal/config"
)

// AuthMiddleware validates the Clerk session token from the Authorization header
func AuthMiddleware(cfg *config.Config) gin.HandlerFunc {
	// Set the Clerk secret key globally
	clerk.SetKey(cfg.ClerkSecretKey)

	return func(c *gin.Context) {
		// Create a response writer wrapper to check if auth failed
		var authFailed bool

		// Wrap the Clerk middleware to work with Gin
		handler := clerkhttp.RequireHeaderAuthorization()(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Extract session claims from the request context (set by Clerk middleware)
			claims, ok := clerk.SessionClaimsFromContext(r.Context())
			if !ok {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "no session claims found"})
				c.Abort()
				return
			}

			// Store claims in Gin context
			c.Set("clerk_claims", claims)
			c.Set("user_id", claims.Subject)

			// Update the request in Gin context with the new context containing claims
			c.Request = r
			c.Next()
		}))

		// Create a custom response writer to capture auth failures
		rw := &authResponseWriter{
			ResponseWriter: c.Writer,
			onAuthFail: func() {
				authFailed = true
			},
		}

		// Execute the Clerk middleware
		handler.ServeHTTP(rw, c.Request)

		// If auth failed, abort the request
		if authFailed {
			c.Abort()
		}
	}
}

// authResponseWriter wraps http.ResponseWriter to detect auth failures
type authResponseWriter struct {
	http.ResponseWriter
	onAuthFail func()
}

func (w *authResponseWriter) WriteHeader(statusCode int) {
	if statusCode == http.StatusForbidden {
		w.onAuthFail()
	}
	w.ResponseWriter.WriteHeader(statusCode)
}
