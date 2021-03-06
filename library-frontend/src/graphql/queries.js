import { gql } from '@apollo/client'

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
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
`

export const ALL_AUTHORS = gql`
    query getAllAuthors{
        allAuthors{
            name
            born
            bookCount
            id
        }
    }   
`

export const ALL_BOOKS = gql`
    query getAllBooks{
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
  query findBookByGenre($genreToSearch: String!) {
    allBooks(genre: $genreToSearch) {
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


export const ME = gql`
    query whoAmI{
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

export const SUB_PERSON_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`
