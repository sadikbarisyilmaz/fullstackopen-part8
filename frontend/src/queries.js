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


// export const all_books = gql`
//   query {
//     allBooks {
//       title
//       author {
//         name
//         id
//       }
//       published
//       genres
//     }
//   }
// `;

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

export const all_books = gql`
query AllBooks($genre: String) {
  allBooks(genre: $genre) {
    title
      author {
        name
        id
      }
      published
      genres
  }
}
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
      title
      author
      published
      genres
    }
  }
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