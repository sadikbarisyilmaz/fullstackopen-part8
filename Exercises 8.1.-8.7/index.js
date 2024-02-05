import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { v4 as uuidv4 } from 'uuid';

let authors = [
    {
        name: 'Robert Martin',
        id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
        born: 1952,
    },
    {
        name: 'Martin Fowler',
        id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
        born: 1963
    },
    {
        name: 'Fyodor Dostoevsky',
        id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
        born: 1821
    },
    {
        name: 'Joshua Kerievsky', // birthyear not known
        id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
    },
    {
        name: 'Sandi Metz', // birthyear not known
        id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
    },
]

let books = [
    {
        title: 'Clean Code',
        published: 2008,
        author: 'Robert Martin',
        id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
        genres: ['refactoring']
    },
    {
        title: 'Agile software development',
        published: 2002,
        author: 'Robert Martin',
        id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
        genres: ['agile', 'patterns', 'design']
    },
    {
        title: 'Refactoring, edition 2',
        published: 2018,
        author: 'Martin Fowler',
        id: "afa5de00-344d-11e9-a414-719c6709cf3e",
        genres: ['refactoring']
    },
    {
        title: 'Refactoring to patterns',
        published: 2008,
        author: 'Joshua Kerievsky',
        id: "afa5de01-344d-11e9-a414-719c6709cf3e",
        genres: ['refactoring', 'patterns']
    },
    {
        title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
        published: 2012,
        author: 'Sandi Metz',
        id: "afa5de02-344d-11e9-a414-719c6709cf3e",
        genres: ['refactoring', 'design']
    },
    {
        title: 'Crime and punishment',
        published: 1866,
        author: 'Fyodor Dostoevsky',
        id: "afa5de03-344d-11e9-a414-719c6709cf3e",
        genres: ['classic', 'crime']
    },
    {
        title: 'The Demon ',
        published: 1872,
        author: 'Fyodor Dostoevsky',
        id: "afa5de04-344d-11e9-a414-719c6709cf3e",
        genres: ['classic', 'revolution']
    },
]

const typeDefs = `
  type Book {
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
    }

  type Query {
        bookCount: Int!
        authorCount: Int!
        allBooks(author: String, genre: String):[Book!]!
        allAuthors:[Author!]!
  }

  type Mutation {
    addBook(
        title: String!,
        author: String!,
        published: Int!
        genres: [String!]!
    ):Book
    editAuthor(
        name: String!
        setBornTo: Int!
      ): Author
  }

  enum YesNo {
    YES
    NO
  }
`

const resolvers = {
    Query: {
        bookCount: () => books.length,
        authorCount: () => {
            const authors = books.map(book => book.author)
            return authors.length
        },
        allBooks: (root, args) => {
            if (!args) {
                return books
            }
            if (args.author && args.genre) {
                const authorsBooks = books.filter(book => book.author === args.author)
                const authorsBooksByGenre = authorsBooks.filter(book => book.genres.includes(args.genre))
                return authorsBooksByGenre
            }
            if (args.author) {
                const authorsBooks = books.filter(book => book.author === args.author)
                return authorsBooks
            }
            if (args.genre) {
                const authorsBooks = books.filter(book => book.genres.includes(args.genre))
                return authorsBooks
            }

        },

        allAuthors: () => {
            const allAuthors = authors.map(author => {
                const authorsBooks = books.filter(book => book.author === author.name)
                return { name: author.name, born: author.born, bookCount: authorsBooks.length }
            }
            )
            return allAuthors
        }
    },
    Mutation: {
        addBook: (root, args) => {
            const book = { ...args, id: uuidv4() }
            books = books.concat(book)
            const doesAuthorExist = authors.map(author => author.name).includes(args.author)
            if (!doesAuthorExist) {
                const author = { name: args.author, id: uuidv4() }
                authors = authors.concat(author)
            }
            return { title: book.title, author: book.author }
        },
        editAuthor: (root, args) => {
            const doesAuthorExist = authors.map(author => author.name).includes(args.name)
            if (doesAuthorExist) {

                authors = authors.map(author => {
                    if (author.name === args.name) {
                        return { ...args, born: args.setBornTo }
                    }
                    return author
                })

                return { name: args.name, born: args.setBornTo }
            } else {
                return null
            }

        },
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
})

startStandaloneServer(server, {
    listen: { port: 4000 },
}).then(({ url }) => {
    console.log(`Server ready at ${url}`)
})