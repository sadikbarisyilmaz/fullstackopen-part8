import { gql } from "@apollo/client";

export const all_authors = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`;


export const me = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`;

export const all_genres = gql`
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

export const all_books = gql`
query AllBooks($genre: String) {
  allBooks(genre: $genre) {
   ...BookDetails
  }
}
${BOOK_DETAILS}
`;

export const new_book = gql`
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
      ...BookDetails
    }
  }
${BOOK_DETAILS}
`;


export const update_author = gql`
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