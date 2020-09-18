
import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login';

import { SUB_PERSON_ADDED, ALL_BOOKS, ADD_BOOK } from './graphql/queries';
import {
  useSubscription, useApolloClient, useQuery
} from '@apollo/client'

const App = () => {
  const [page, setPage] = useState('books')
  const [token, setToken] = useState(null)
  const [newStuff, setNewStuff] = useState(false)
  const client = useApolloClient()

  // const updateAllBooksCacheIfNew = (inStoreCache, newBook) => {
  //   console.log('päivitys funktio');
  //   const allBooksInCache = inStoreCache.allBooks
  //   const bookAlreadyInCache = allBooksInCache.map(book => book.id).includes(newBook.id)

  //   if(!bookAlreadyInCache){
  //     client.writeQuery({
  //       query: ALL_BOOKS,
  //       data: [...allBooksInCache, newBook]
  //     })
  //     console.log('added new book :>> ', newBook)
  //     setNewStuff(true)
  //     window.alert('new book')
  //   }
  // }

  // useSubscription(SUB_PERSON_ADDED, {
  //   onSubscriptionData: ({ subscriptionData }) => {
  //     console.log('subscriptiondata :>> ', subscriptionData)
  //     const dataInStore = client.readQuery({query: ALL_BOOKS })
  //     console.log('dataInStore :>> ', dataInStore)
  //     updateAllBooksCacheIfNew(dataInStore, subscriptionData.data.bookAdded)
  //   }
  // })

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token ? <button onClick={() => setPage('add')}>add book</button> : null}
        <Login setToken={setToken} />
      </div>

      <Authors
        token={token}
        show={page === 'authors'}
      />

      <Books
        token={ token }
        show={page === 'books'}
        newStuff={ newStuff }
        setNewStuff={ setNewStuff }
      />

      <NewBook
        token={ token }
        setPageProp={ setPage }
        show={page === 'add'}
      />

    </div>
  )
}

export default App