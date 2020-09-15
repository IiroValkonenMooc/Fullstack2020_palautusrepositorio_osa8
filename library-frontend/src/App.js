
import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login';

const App = () => {
  const [page, setPage] = useState('books')
  const [token, setToken] = useState(null)


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