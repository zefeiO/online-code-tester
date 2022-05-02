import React from 'react'
import Test from './Test'
import Loading from './Loading'
import { useGlobalContext } from '../context'

export default function TestlList() {
  const { tests, loading } = useGlobalContext()
  if (loading) {
    return <Loading/>
  }
  if (tests.length < 1) {
    return (
      <h2 className='section-title'>
        no tests matched your search criteria
      </h2>
    )
  }
  return (
    <section className='section'>
      <h2 className='section-title'>tests</h2>
      <div className='cocktails-center'>
        {tests.map((item) => {
          return <Test key={item.test_id} {...item} />
        })}
      </div>
    </section>
  )
}
