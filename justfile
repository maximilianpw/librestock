# Bootstrap both frontend and backend
bootstrap:
  just modules/web/bootstrap

# Decrypt environment variables for both apps
decrypt:
  just modules/web/decrypt
  just modules/api/decrypt

# Frontend commands
web:
  just modules/web/dev

lint:
  just modules/web/lint

wtest:
  just modules/web/test

# Backend commands
api:
  just modules/api/run

migrate-up:
  just modules/api/migrate-up

migrate-down:
  just modules/api/migrate-down

migrate-status:
  just modules/api/migrate-status
