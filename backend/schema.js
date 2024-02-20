export const typeDefs = `
  type Book {
        title: String!
        author: Author!
        published: Int! 
        genres: [String!]!
        id: ID!
    }

  type NewBook {
        title: String!
        author: String!
        published: Int! 
        genres: [String!]!
        id: ID!
    }

  type Author {
        name: String!
        bookCount: Int
        born: Int
        id:ID!
    }
  type Genre {
       value:String!
    }

  type User {
        username: String!
        favoriteGenre: String!
        id: ID!
    }
        
  type Token {
        value: String!
    }

  type Query {
        bookCount: Int!
        authorCount: Int!
        allBooks(author: ID, genre: String):[Book!]!
        allAuthors:[Author!]!
        allGenres:[String!]!
        me: User
  }

  type Mutation {
    addBook(
        title: String!,
        author: String!,
        published: Int!
        genres: [String!]!
    ):NewBook
    editAuthor(
        name: String!
        setBornTo: Int!
    ): Author
    createUser(
        username: String!
        favoriteGenre: String!
    ): User
    login(
        username: String!
        password: String!
    ): Token
  }

  type Subscription {
    bookAdded: Book!
  }    
`