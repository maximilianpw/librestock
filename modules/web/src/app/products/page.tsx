'use client'

import { useState } from 'react'

export default function ProductPage() {
  const [categories, setCategories] = useState([])
  return (
    <div className="p-4">
      {categories &&
        categories.map((category, index) => {
          return <p key={index}>{category}</p>
        })}
    </div>
  )
}
