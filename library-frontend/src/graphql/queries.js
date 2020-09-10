import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
    query {
        allAuthors{
            name
            born
            bookCount
        }
    }   
`

export const ALL_BOOKS = gql`
    query{
        allBooks{
            title
            author
            published
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