import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { connect, set } from 'mongoose'
import "dotenv/config";
import { Author } from './models/author.js';
import { Book } from './models/book.js';
import { GraphQLError } from 'graphql';

const MONGODB_URI = process.env.MONGODB_URI
set('strictQuery', false)
console.log('connecting to', MONGODB_URI)
connect(MONGODB_URI)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connection to MongoDB:', error.message)
    })



// let authors = [
//     {
//         name: 'Robert Martin',
//         born: 1952,
//     },
//     {
//         name: 'Martin Fowler',
//         born: 1963
//     },
//     {
//         name: 'Fyodor Dostoevsky',
//         born: 1821
//     },
//     {
//         name: 'Joshua Kerievsky',
//     },
//     {
//         name: 'Sandi Metz',
//     },
// ]

// let books = [
//     {
//         title: 'Clean Code',
//         published: 2008,
//         author: 'Robert Martin',
//         id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
//         genres: ['refactoring']
//     },
//     {
//         title: 'Agile software development',
//         published: 2002,
//         author: 'Robert Martin',
//         id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
//         genres: ['agile', 'patterns', 'design']
//     },
//     {
//         title: 'Refactoring, edition 2',
//         published: 2018,
//         author: 'Martin Fowler',
//         id: "afa5de00-344d-11e9-a414-719c6709cf3e",
//         genres: ['refactoring']
//     },
//     {
//         title: 'Refactoring to patterns',
//         published: 2008,
//         author: 'Joshua Kerievsky',
//         id: "afa5de01-344d-11e9-a414-719c6709cf3e",
//         genres: ['refactoring', 'patterns']
//     },
//     {
//         title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
//         published: 2012,
//         author: 'Sandi Metz',
//         id: "afa5de02-344d-11e9-a414-719c6709cf3e",
//         genres: ['refactoring', 'design']
//     },
//     {
//         title: 'Crime and punishment',
//         published: 1866,
//         author: 'Fyodor Dostoevsky',
//         id: "afa5de03-344d-11e9-a414-719c6709cf3e",
//         genres: ['classic', 'crime']
//     },
//     {
//         title: 'The Demon ',
//         published: 1872,
//         author: 'Fyodor Dostoevsky',
//         id: "afa5de04-344d-11e9-a414-719c6709cf3e",
//         genres: ['classic', 'revolution']
//     },
// ]

const typeDefs = `
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

  type Query {
        bookCount: Int!
        authorCount: Int!
        allBooks(author: ID, genre: String):[Book!]!
        allAuthors:[Author!]!
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
  }

  enum YesNo {
    YES
    NO
  }
`

const resolvers = {
    Query: {
        bookCount: async () => Book.collection.countDocuments(),
        authorCount: async () => Author.collection.countDocuments(),
        allBooks: async (root, args) => {
            if (args.author && args.genre) {
                return Book.find({
                    genres: args.genre, author: args.author,
                }).
                    populate('author')
            }
            if (args.genre) {
                return Book.find({ genres: args.genre }).
                    populate('author')
            }
            if (args.author) {
                return Book.find({ author: args.author }).
                    populate('author')
            }

            return Book.find({}).
                populate('author')

        },

        allAuthors: async (root, args) => {
            return Author.find({})
        }
    },

    Mutation: {
        addBook: async (root, args) => {
            const book = new Book({ ...args })
            try {
                await book.save()
            } catch (error) {
                throw new GraphQLError(error.message, {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.name,
                        error
                    }
                })
            }
            return book
        },

        editAuthor: async (root, args) => {
            const author = await Author.findOne({ name: args.name })
            author.born = args.setBornTo
            try {
                await author.save()
            } catch (error) {
                throw new GraphQLError(error.message, {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.name,
                        error
                    }
                })
            }
            return author
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