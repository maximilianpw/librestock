package errors

import "fmt"

// ConflictError represents a domain error for resource conflicts.
type ConflictError struct {
	Message string
}

func (e *ConflictError) Error() string {
	return e.Message
}

// NewConflictError creates a new ConflictError with the given message.
func NewConflictError(message string) *ConflictError {
	return &ConflictError{Message: message}
}

// IsConflict returns true if the error is a ConflictError.
func IsConflict(err error) bool {
	_, ok := err.(*ConflictError)
	return ok
}

// NotFoundError represents a domain error for missing resources.
type NotFoundError struct {
	Message string
}

func (e *NotFoundError) Error() string {
	return e.Message
}

// NewNotFoundError creates a new NotFoundError with the given message.
func NewNotFoundError(message string) *NotFoundError {
	return &NotFoundError{Message: message}
}

// IsNotFound returns true if the error is a NotFoundError.
func IsNotFound(err error) bool {
	_, ok := err.(*NotFoundError)
	return ok
}

// ValidationError represents a domain error for invalid input.
type ValidationError struct {
	Message string
	Field   string
}

func (e *ValidationError) Error() string {
	if e.Field != "" {
		return fmt.Sprintf("validation error on %s: %s", e.Field, e.Message)
	}
	return e.Message
}

// NewValidationError creates a new ValidationError with the given message.
func NewValidationError(message string) *ValidationError {
	return &ValidationError{Message: message}
}

// NewValidationErrorWithField creates a new ValidationError with a field name.
func NewValidationErrorWithField(field, message string) *ValidationError {
	return &ValidationError{Field: field, Message: message}
}

// IsValidation returns true if the error is a ValidationError.
func IsValidation(err error) bool {
	_, ok := err.(*ValidationError)
	return ok
}

// UnauthorizedError represents a domain error for authentication failures.
type UnauthorizedError struct {
	Message string
}

func (e *UnauthorizedError) Error() string {
	return e.Message
}

// NewUnauthorizedError creates a new UnauthorizedError with the given message.
func NewUnauthorizedError(message string) *UnauthorizedError {
	return &UnauthorizedError{Message: message}
}

// IsUnauthorized returns true if the error is an UnauthorizedError.
func IsUnauthorized(err error) bool {
	_, ok := err.(*UnauthorizedError)
	return ok
}

// ForbiddenError represents a domain error for authorization failures.
type ForbiddenError struct {
	Message string
}

func (e *ForbiddenError) Error() string {
	return e.Message
}

// NewForbiddenError creates a new ForbiddenError with the given message.
func NewForbiddenError(message string) *ForbiddenError {
	return &ForbiddenError{Message: message}
}

// IsForbidden returns true if the error is a ForbiddenError.
func IsForbidden(err error) bool {
	_, ok := err.(*ForbiddenError)
	return ok
}

// InternalError represents an unexpected internal error.
type InternalError struct {
	Message string
}

func (e *InternalError) Error() string {
	return e.Message
}

// NewInternalError creates a new InternalError with the given message.
func NewInternalError(message string) *InternalError {
	return &InternalError{Message: message}
}

// IsInternal returns true if the error is an InternalError.
func IsInternal(err error) bool {
	_, ok := err.(*InternalError)
	return ok
}

// BadRequestError represents a domain error for malformed requests.
type BadRequestError struct {
	Message string
}

func (e *BadRequestError) Error() string {
	return e.Message
}

// NewBadRequestError creates a new BadRequestError with the given message.
func NewBadRequestError(message string) *BadRequestError {
	return &BadRequestError{Message: message}
}

// IsBadRequest returns true if the error is a BadRequestError.
func IsBadRequest(err error) bool {
	_, ok := err.(*BadRequestError)
	return ok
}

// AlreadyExistsError represents a domain error when a resource already exists.
type AlreadyExistsError struct {
	Message string
}

func (e *AlreadyExistsError) Error() string {
	return e.Message
}

// NewAlreadyExistsError creates a new AlreadyExistsError with the given message.
func NewAlreadyExistsError(message string) *AlreadyExistsError {
	return &AlreadyExistsError{Message: message}
}

// IsAlreadyExists returns true if the error is an AlreadyExistsError.
func IsAlreadyExists(err error) bool {
	_, ok := err.(*AlreadyExistsError)
	return ok
}

// InvalidStateError represents a domain error for invalid state transitions.
type InvalidStateError struct {
	Message string
	Current string
	Desired string
}

func (e *InvalidStateError) Error() string {
	if e.Current != "" && e.Desired != "" {
		return fmt.Sprintf("invalid state transition: cannot go from %s to %s (%s)", e.Current, e.Desired, e.Message)
	}
	return e.Message
}

// NewInvalidStateError creates a new InvalidStateError with the given message.
func NewInvalidStateError(message string) *InvalidStateError {
	return &InvalidStateError{Message: message}
}

// NewInvalidStateErrorWithTransition creates an InvalidStateError for state transitions.
func NewInvalidStateErrorWithTransition(current, desired, message string) *InvalidStateError {
	return &InvalidStateError{Message: message, Current: current, Desired: desired}
}

// IsInvalidState returns true if the error is an InvalidStateError.
func IsInvalidState(err error) bool {
	_, ok := err.(*InvalidStateError)
	return ok
}

// RateLimitError represents a domain error for rate limiting.
type RateLimitError struct {
	Message  string
	RetryIn  int64 // milliseconds
	LimitKey string
}

func (e *RateLimitError) Error() string {
	return e.Message
}

// NewRateLimitError creates a new RateLimitError with the given message.
func NewRateLimitError(message string) *RateLimitError {
	return &RateLimitError{Message: message}
}

// NewRateLimitErrorWithRetry creates a RateLimitError with retry information.
func NewRateLimitErrorWithRetry(message string, retryInMs int64) *RateLimitError {
	return &RateLimitError{Message: message, RetryIn: retryInMs}
}

// IsRateLimit returns true if the error is a RateLimitError.
func IsRateLimit(err error) bool {
	_, ok := err.(*RateLimitError)
	return ok
}

// ServiceUnavailableError represents a domain error for external service failures.
type ServiceUnavailableError struct {
	Message   string
	Service   string
	Retryable bool
}

func (e *ServiceUnavailableError) Error() string {
	if e.Service != "" {
		return fmt.Sprintf("service unavailable: %s (%s)", e.Service, e.Message)
	}
	return e.Message
}

// NewServiceUnavailableError creates a new ServiceUnavailableError with the given message.
func NewServiceUnavailableError(message string) *ServiceUnavailableError {
	return &ServiceUnavailableError{Message: message, Retryable: true}
}

// NewServiceUnavailableErrorWithService creates a ServiceUnavailableError for a specific service.
func NewServiceUnavailableErrorWithService(service, message string, retryable bool) *ServiceUnavailableError {
	return &ServiceUnavailableError{Service: service, Message: message, Retryable: retryable}
}

// IsServiceUnavailable returns true if the error is a ServiceUnavailableError.
func IsServiceUnavailable(err error) bool {
	_, ok := err.(*ServiceUnavailableError)
	return ok
}

// TimeoutError represents a domain error for operation timeouts.
type TimeoutError struct {
	Message   string
	Operation string
	Duration  int64 // milliseconds
}

func (e *TimeoutError) Error() string {
	if e.Operation != "" {
		return fmt.Sprintf("operation timeout: %s after %dms (%s)", e.Operation, e.Duration, e.Message)
	}
	return e.Message
}

// NewTimeoutError creates a new TimeoutError with the given message.
func NewTimeoutError(message string) *TimeoutError {
	return &TimeoutError{Message: message}
}

// NewTimeoutErrorWithDuration creates a TimeoutError with timing information.
func NewTimeoutErrorWithDuration(operation string, durationMs int64, message string) *TimeoutError {
	return &TimeoutError{Operation: operation, Duration: durationMs, Message: message}
}

// IsTimeout returns true if the error is a TimeoutError.
func IsTimeout(err error) bool {
	_, ok := err.(*TimeoutError)
	return ok
}
