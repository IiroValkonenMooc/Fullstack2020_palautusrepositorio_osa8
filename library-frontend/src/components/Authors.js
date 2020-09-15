import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client';
import { ALL_AUTHORS, CHANGE_BIRTHYEAR } from '../graphql/queries';

const Authors = (props) => {
  const [authors, setAuthors] = useState([])
  const { loading, error, data } = useQuery(ALL_AUTHORS)
  const [authorNameField, setAuthorNameField] = useState('')
  const [authorBirthyearField, setAuthorBirthyearField] = useState('')
  const [changeBirthyear] = useMutation(CHANGE_BIRTHYEAR, {
    refetchQueries: [ {query: ALL_AUTHORS} ]
  })

  if (!props.show||loading) {
    return null
  }

  if(data && authors!==data.allAuthors){
    console.log('data.allAuthors :>> ', data.allAuthors);
    setAuthors(data.allAuthors)
  }

  const updateAuhor = (event) => {
    event.preventDefault()

    changeBirthyear({ variables: { name: authorNameField, birthyear: authorBirthyearField} })
  }

  const displayValue = props.token ? '' : 'none'
  console.log('props.token :>> ', props.token);
  
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      <form onSubmit={updateAuhor} style={{ display: displayValue }} >
        <h2>Set birthyear</h2>
        {/* <div>
          {'name'}
          <input
            value={authorNameField}
            onChange={({ target }) => setAuthorNameField(target.value)}
          />
        </div> */}
        <div>
          {'name'}
          <select
            value={authorNameField}
            onChange={({ target }) => setAuthorNameField(target.value)}
          >
            {authors.map(author => <option key={author.id} value={author.name}>{author.name}</option>)}
          </select>
        </div>
        
          <div>
            {'birthyear'}
            <input
              type='number'
              value={authorBirthyearField}
              onChange={({ target }) => setAuthorBirthyearField(Number(target.value))}
            />
          </div>
          <div>
            <button type="submit" >
              update author
          </button>
          
        </div>
      </form>
    </div>
  )
}

export default Authors
