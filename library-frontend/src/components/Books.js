import React, { useState, useEffect } from 'react'
import SelectedBooksForUser from './SelectedBooksForUser';
import { useQuery, useLazyQuery, useSubscription, useApolloClient } from '@apollo/client';
import { ALL_BOOKS, ME, ALL_BOOKS_IN_GENRE, SUB_PERSON_ADDED } from '../graphql/queries';

const Books = (props) => {
  const [books, setBooks] = useState([])
  const [booksInGenre, setBooksInGenre] = useState([])
  const [me, setMe] = useState(null)
  const { loading, error, data, refetch } = useQuery(ALL_BOOKS)
  const [getMe, { loading: loadingMe, data: dataMe }] = useLazyQuery(ME)
  const [getBooksInGenre, {loading: loadingGenre , data: dataBooksInGenre, refetch: refetchGenre }] = useLazyQuery(ALL_BOOKS_IN_GENRE)
  const [bookGenres, setBookGenres] = useState([])
  const [bookGenresFilter, setBookGenresFilter] = useState('all')
  const client = useApolloClient()

  const updateAllBooksCacheIfNew = (inStoreCache, newBook) => {
    console.log('päivitys funktio');
    const allBooksInCache = inStoreCache.allBooks
    const bookAlreadyInCache = allBooksInCache.map(book => book.id).includes(newBook.id)

    if(!bookAlreadyInCache){
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks: [...allBooksInCache, newBook] }
      })
      console.log('added new book :>> ', newBook)
      //setNewStuff(true)
      window.alert('new book')
      console.log('dataAllbook :>> ', data);
    }
  }

  useSubscription(SUB_PERSON_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      console.log('subscriptiondata :>> ', subscriptionData)
      const dataInStore = client.readQuery({query: ALL_BOOKS })
      console.log('dataInStore :>> ', dataInStore)
      updateAllBooksCacheIfNew(dataInStore, subscriptionData.data.bookAdded)
    }
  })

  useEffect( () =>{
    console.log('books update effect');
    if(data){
      setBooks(data.allBooks)

      let bookGenresUnigue = []
      for (let i = 0; i < data.allBooks.length; i++) {
        for (let j = 0; j < data.allBooks[i].genres.length; j++) {
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

      if(props.newStuff){
        console.log('data.allBooks :>> ', data.allBooks);
        refetch()
        props.setNewStuff(false)
      }
    }
  }, [data, props.newStuff])
  
  useEffect( () =>{
    if(props.token){
      getMe()
    } else {
      console.log('user set null');
      setMe(null)
    }
  }, [props, getMe])

  useEffect( () =>{
    //console.log('me update effect');
    //console.log('me :>> ', me);
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