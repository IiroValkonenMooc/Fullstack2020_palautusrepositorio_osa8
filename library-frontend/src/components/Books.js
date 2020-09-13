import React, { useState } from 'react'
import { useQuery, NetworkStatus, useLazyQuery } from '@apollo/client';
import { ALL_BOOKS } from '../graphql/queries';

const Books = (props) => {
  const [books, setBooks] = useState([])
  const { loading, error, data } = useQuery(ALL_BOOKS)
  const [bookGenres, setBookGenres] = useState([])
  const [bookGenresFilter, setBookGenresFilter] = useState('all')

  if (!props.show||loading) {
    return null
  }

  if(data && books!==data.allBooks){
    console.log('loading :>> ', loading);
    console.log('data.allBooks :>> ', data.allBooks);
    setBooks(data.allBooks)

    let bookGenresUnigue = []
    for (let i = 0; i < books.length; i++) {
      for (let j = 0; j < books[i].genres.length; j++) {
        if (books[i].genres[j]
          && !bookGenresUnigue.includes(books[i].genres[j])) {
          bookGenresUnigue.push(books[i].genres[j])
        }
      }
    }
    setBookGenres(bookGenresUnigue)
  }

  return (
    <div>
      <h2>books</h2>
      {'Filter books'}
      <select
            style={{ marginLeft: '1em' }}
            value={bookGenresFilter}
            onChange={({ target }) => setBookGenresFilter(target.value)}
          >
            <option value={'all'} >{'all'}</option>
            {bookGenres.map(genre => <option key={genre} value={genre}>{genre}</option>)}
      </select>

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
          {books.map(book => {
            if(bookGenresFilter === 'all'){
              return (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author.name}</td>
                  <td>{book.published}</td>
                </tr>
              )
            } else {
              if(book.genres.includes(bookGenresFilter)){
                return(
                  <tr key={book.id}>
                    <td>{book.title}</td>
                    <td>{book.author.name}</td>
                    <td>{book.published}</td>
                  </tr>)
              }
            }
          }
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Books