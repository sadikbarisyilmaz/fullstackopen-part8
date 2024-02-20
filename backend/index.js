import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { connect, set } from 'mongoose'
import "dotenv/config";
import { Author } from './models/author.js';
import { Book } from './models/book.js';
import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken'
import { User } from './models/user.js';

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
        allGenres: async (root, args) => {
            const books = await Book.find({})
            const extractGenres = (booksArr) => {
                const genres = [];
                booksArr.forEach((book) => {
                    book.genres.forEach((booksGenre) => {
                        genres.some((genre) => genre === booksGenre)
                            ? ""
                            : genres.push(booksGenre);
                    });
                });
                return genres;
            };

            return extractGenres(books)
        },
        allAuthors: async (root, args) => {
            return Author.find({})
        },
        me: (root, args, context) => {
            return context.currentUser
        }
    },

    Mutation: {
        addBook: async (root, args, context) => {
            const currentUser = context.currentUser
            if (!currentUser) {
                throw new GraphQLError('not authenticated', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    }
                })
            }
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

        editAuthor: async (root, args, context) => {
            const currentUser = context.currentUser
            if (!currentUser) {
                throw new GraphQLError('not authenticated', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    }
                })
            }
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
        createUser: async (root, args) => {

            const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })

            return user.save()
                .catch(error => {
                    throw new GraphQLError('Creating the user failed', {
                        extensions: {
                            code: 'BAD_USER_INPUT',
                            invalidArgs: args.username,
                            error
                        }
                    })
                })
        },
        login: async (root, args) => {
            const user = await User.findOne({ username: args.username })

            if (!user || args.password !== 'secret') {
                throw new GraphQLError('wrong credentials', {
                    extensions: {
                        code: 'BAD_USER_INPUT'
                    }
                })
            }

            const userForToken = {
                username: user.username,
                id: user._id,
            }

            return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
        },

    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
})

startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req, res }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.startsWith('Bearer ')) {
            const decodedToken = jwt.verify(
                auth.substring(7), process.env.JWT_SECRET
            )
            const currentUser = await User
                .findById(decodedToken.id)
            return { currentUser }
        }
    },
}).then(({ url }) => {
    console.log(`Server ready at ${url}`)
})