import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
    query {
        allAuthors{
            name
            born
            bookCount
            id
        }
    }   
`

export const ALL_BOOKS = gql`
    query{
        allBooks{
            id
            title
            author {
                name
                id
                born
                bookCount
            }
            published
            genres
        }
    }
`

export const ALL_BOOKS_IN_GENRE = gql`
  query findBooksFromGenre($genreToSearch: String!) {
    allBooks(genre: $genreToSearch) {
      title
      author
      published
    }
  }
`


export const ME = gql`
    query{
        me{
            username
            favoriteGenre
            id
        }
    }
`

export const ADD_BOOK = gql`
    mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String]!) {
        addBook(title: $title, author: $author, published: $published, genres: $genres) {
            title
        }
  }
`

export const CHANGE_BIRTHYEAR = gql`
    mutation changeBirthyear($name: String!, $birthyear: Int!){
        editAuthor(name: $name, setBornTo: $birthyear){
            name
            born
        }
    }
`

export const LOGIN = gql`
    mutation login ($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            value
        }
    }
`