import { Author } from './models/author.js';
import { Book } from './models/book.js';
import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken'
import { User } from './models/user.js';
import { PubSub } from 'graphql-subscriptions'

const pubsub = new PubSub()

export const resolvers = {
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
                console.log(error);
                throw new GraphQLError(error.message, {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.name,
                        error
                    }
                })
            }
            pubsub.publish('BOOK_ADDED', { bookAdded: book })
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

    },
    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
        },
    },
}