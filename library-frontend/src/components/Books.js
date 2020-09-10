import React, { useState } from 'react'
import { useQuery } from '@apollo/client';
import { ALL_BOOKS } from '../graphql/queries';

const Books = (props) => {
  const [books, setBooks] = useState([])
  const { loading, error, data } = useQuery(ALL_BOOKS)

  if (!props.show||loading) {
    return null
  }

  if(books!==data.allBooks){
    console.log('data.allBooks :>> ', data.allBooks);
    setBooks(data.allBooks)
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Books