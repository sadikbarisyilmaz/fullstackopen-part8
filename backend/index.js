import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { connect, set } from 'mongoose'
import "dotenv/config";
import { Author } from './models/author.js';
import { Book } from './models/book.js';

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
            // if (args.author && args.genre) {
            //     const authorsBooks = books.filter(book => book.author === args.author)
            //     const authorsBooksByGenre = authorsBooks.filter(book => book.genres.includes(args.genre))
            //     return authorsBooksByGenre
            // }
            // if (args.author) {
            //     const authorsBooks = books.filter(book => book.author === args.author)
            //     return authorsBooks
            // }
            // if (args.genre) {
            //     const authorsBooks = books.filter(book => book.genres.includes(args.genre))
            //     return authorsBooks
            // }
            // return books

            // if (args.author) {
            //     return Book.find({ author: args.author })
            // }
            return Book.find({}).
                populate('author')
        },

        allAuthors: async (root, args) => {
            // const allAuthors = authors.map(author => {
            //     const authorsBooks = books.filter(book => book.author === author.name)
            //     return { name: author.name, born: author.born, bookCount: authorsBooks.length }
            // }
            // )
            // return allAuthors

            return Author.find({})
        }
    },

    Mutation: {
        addBook: async (root, args) => {
            const book = new Book({ ...args })

            // const doesAuthorExist = authors.map(author => author.name).includes(args.author)
            // const doesTitleExist = books.some(book => book.title === args.title)

            // if (!doesTitleExist) {
            //     books = books.concat(book)
            // } else {
            //     throw new GraphQLError('Title must be unique', {
            //         extensions: {
            //             code: 'BAD_USER_INPUT',
            //             invalidArgs: args.title
            //         }
            //     })
            // }

            // if (!doesAuthorExist) {
            //     const author = { name: args.author, id: uuidv4() }
            //     authors = authors.concat(author)
            // }

            return book.save()
        },

        editAuthor: async (root, args) => {
            // const doesAuthorExist = authors.map(author => author.name).includes(args.name)
            // if (doesAuthorExist) {

            //     authors = authors.map(author => {
            //         if (author.name === args.name) {
            //             return { ...args, born: args.setBornTo }
            //         }
            //         return author
            //     })

            //     return { name: args.name, born: args.setBornTo }
            // } else {
            //     return null
            // }
            const author = await Author.findOne({ name: args.name })
            author.born = args.setBornTo
            return author.save()
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