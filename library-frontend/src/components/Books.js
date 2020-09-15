import React, { useState, useEffect } from 'react'
import SelectedBooksForUser from './SelectedBooksForUser';
import { useQuery, useLazyQuery } from '@apollo/client';
import { ALL_BOOKS, ME } from '../graphql/queries';

const Books = (props) => {
  const [books, setBooks] = useState([])
  const [me, setMe] = useState([])
  const { loading, error, data } = useQuery(ALL_BOOKS)
  const [getMe, { loading: loadingMe, data: dataMe }] = useLazyQuery(ME)
  const [bookGenres, setBookGenres] = useState([])
  const [bookGenresFilter, setBookGenresFilter] = useState('all')

  useEffect( () =>{
    if(props.token){
      getMe()
    } else {
      setMe(null)
    }
  }, [props.token])

  if (!me && dataMe) {
    const { __typename, ...rest } = dataMe.me
    setMe(rest)
  }

  if (!props.show||loading) {
    return null
  }

  if(data && books!==data.allBooks){
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

  const showRecommendedForUser = (me) ? true : false

  return (
    <div>
      <h2>books</h2>
      { showRecommendedForUser 
        ? <SelectedBooksForUser me={me} books={books}  />
        : null
      }
      {'Filter books'}
      <select
            style={{ marginLeft: '1em', marginTop: '2em' }}
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