import React, { useState, useEffect } from 'react'
import SelectedBooksForUser from './SelectedBooksForUser';
import { useQuery, useLazyQuery } from '@apollo/client';
import { ALL_BOOKS, ME, ALL_BOOKS_IN_GENRE } from '../graphql/queries';

const Books = (props) => {
  const [books, setBooks] = useState([])
  const [booksInGenre, setBooksInGenre] = useState([])
  const [me, setMe] = useState(null)
  const { loading, error, data } = useQuery(ALL_BOOKS)
  const [getMe, { loading: loadingMe, data: dataMe }] = useLazyQuery(ME)
  const [getBooksInGenre, {loading: loadingGenre , data: dataBooksInGenre, refetch: refetchGenre }] = useLazyQuery(ALL_BOOKS_IN_GENRE)
  const [bookGenres, setBookGenres] = useState([])
  const [bookGenresFilter, setBookGenresFilter] = useState('all')

  useEffect( () =>{
    console.log('books update effect');
    if(data){
      setBooks(data.allBooks)

      let bookGenresUnigue = []
      for (let i = 0; i < data.allBooks.length; i++) {
        for (let j = 0; j < data.allBooks[i].genres.length; j++) {
          console.log('here');
          if (data.allBooks[i].genres[j]
            && !bookGenresUnigue.includes(data.allBooks[i].genres[j])) {
            bookGenresUnigue.push(data.allBooks[i].genres[j])
          }
        }
      }
      setBookGenres(bookGenresUnigue)

      if(me){
        refetchGenre()
      }
    }
  }, [data])
  
  useEffect( () =>{
    if(props.token){
      getMe()
    } else {
      console.log('user set null');
      setMe(null)
    }
  }, [props, getMe])

  useEffect( () =>{
    console.log('me update effect');
    console.log('me :>> ', me);
    if(me){
      getBooksInGenre({ variables: { genreToSearch: me.favoriteGenre } })
    }
    
  }, [me])

  if (props.token && !me && dataMe) {
    const { __typename, ...restMe } = dataMe.me
    setMe(restMe)
  }

  if (dataBooksInGenre && dataBooksInGenre.allBooks !== booksInGenre) {
    setBooksInGenre(dataBooksInGenre.allBooks)
  }

  if (!props.show||loading) {
    return null
  }

  const showRecommendedForUser = (me) ? true : false

  return (
    <div>
      <h2>books</h2>
      { showRecommendedForUser 
        ? <SelectedBooksForUser me={me} books={books} booksFiltered={booksInGenre} />
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