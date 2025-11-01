import { createFileRoute } from '@tanstack/react-router'
import * as Sentry from '@sentry/tanstackstart-react'

export const Route = createFileRoute('/')({
  component: App,
})

function ErrorButton() {
  return (
    <button
      onClick={() => {
        throw new Error('This is your first error!')
      }}
    >
      Break the world
    </button>
  )
}
function App() {
  return (
    <div className="text-center">
      <ErrorButton />
    </div>
  )
}
