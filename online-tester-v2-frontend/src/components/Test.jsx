import React from 'react'
import { Link } from 'react-router-dom'


export default function Test({ test_id, test_name }) {
  
  return (
    <article className='cocktail'>
      <div className='cocktail-footer'>
        <h3>{test_name}</h3>
        <Link to={`/test/${test_name}/${test_id}`} className='btn btn-primary btn-details'>
          Enter
        </Link>
      </div>
    </article>
  )
}
