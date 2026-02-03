export const TEST_USER = {
  name: 'E2E Test User',
  email: 'e2e-test@librestock.local',
  password: 'TestPassword123!',
}

async function globalSetup(): Promise<void> {
  const response = await fetch('http://localhost:8080/api/auth/sign-up/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: TEST_USER.name,
      email: TEST_USER.email,
      password: TEST_USER.password,
    }),
  })

  if (response.ok) {
    console.log('Test user created successfully')
  } else if (response.status === 422 || response.status === 409) {
    console.log('Test user already exists, skipping creation')
  } else {
    const body = await response.text()
    throw new Error(
      `Failed to create test user: ${response.status} ${response.statusText}\n${body}`,
    )
  }
}

export default globalSetup
