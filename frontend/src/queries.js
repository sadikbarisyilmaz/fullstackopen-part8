import { gql } from "@apollo/client";

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`;

export const ME = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`;

export const ALL_GENRES = gql`
  query {
    allGenres
  }
`;


const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    author{
      name
      id
    }
    published
    genres
  }
`

export const ALL_BOOKS = gql`
query AllBooks($genre: String) {
  allBooks(genre: $genre) {
   ...BookDetails
  }
}
${BOOK_DETAILS}
`;

export const ADD_BOOK = gql`
  mutation createPerson(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
    title
    author
    published
    genres
    }
  }
`;

export const UPDATE_AUTHOR = gql`
  mutation updateAuthor(
    $name: String!
    $setBornTo: Int!
  ) {
    editAuthor(
      name: $name
      setBornTo: $setBornTo
    ) {
      name
      born
    }
  }
`;

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      title
    }
  }
`