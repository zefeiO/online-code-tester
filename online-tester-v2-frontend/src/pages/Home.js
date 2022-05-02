import React from 'react'
import TestList from '../components/TestList'
import SearchForm from '../components/SearchForm'
export default function Home() {
  return (
    <main>
      <SearchForm />
      <TestList />
    </main>
  )
}
