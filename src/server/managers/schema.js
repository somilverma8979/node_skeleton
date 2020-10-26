const graphql = require('graphql');
// const Book = require('../models/book');
// const Author = require('../models/Author');

const {
    GraphQLObjectType, GraphQLString,
    GraphQLID, GraphQLInt, GraphQLSchema,
    GraphQLList, GraphQLNonNull
} = graphql;
let RootQuery, Mutation
Schema = (function (wagner) {
    console.log("12", wagner)
    var global_wagner;

    function Schema(wagner) {
        console.log("16", wagner)
        global_wagner = wagner;
    }
    //Schema defines data on the Graph like object types(book type), relation between 
    //these object types and describes how it can reach into the graph to interact with 
    //the data to retrieve or mutate the data   

    const BookType = new GraphQLObjectType({
        name: 'Book',
        //We are wrapping fields in the function as we dont want to execute this ultil 
        //everything is inilized. For example below code will throw error AuthorType not 
        //found if not wrapped in a function
        fields: () => ({
            id: { type: GraphQLID },
            name: { type: GraphQLString },
            pages: { type: GraphQLInt },
            author: {
                type: AuthorType,
                resolve(parent, args) {
                    let Author = global_wagner.get("Author")
                    return Author.findById(parent.authorID);
                }
            }
        })
    });

    const AuthorType = new GraphQLObjectType({
        name: 'Author',
        fields: () => ({
            id: { type: GraphQLID },
            name: { type: GraphQLString },
            age: { type: GraphQLInt },
            book: {
                type: new GraphQLList(BookType),
                resolve(parent, args) {
                    return Book.find({ authorID: parent.id });
                }
            }
        })
    })

    //RootQuery describe how users can use the graph and grab data.
    //E.g Root query to get all authors, get all books, get a particular 
    //book or get a particular author.
     RootQuery = new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
            book: {
                type: BookType,
                //argument passed by the user while making the query
                args: { id: { type: GraphQLID } },
                resolve(parent, args) {
                    //Here we define how to get data from database source

                    //this will return the book with id passed in argument 
                    //by the user
                    return Book.findById(args.id);
                }
            },
            books: {
                type: new GraphQLList(BookType),
                resolve(parent, args) {
                    let Book = global_wagner.get("Book")
                    return Book.find({});
                }
            },
            author: {
                type: AuthorType,
                args: { id: { type: GraphQLID } },
                resolve(parent, args) {
                    return Author.findById(args.id);
                }
            },
            authors: {
                type: new GraphQLList(AuthorType),
                resolve(parent, args) {
                    return Author.find({});
                }
            }
        }
    });

    //Very similar to RootQuery helps user to add/update to the database.
     Mutation = new GraphQLObjectType({
        name: 'Mutation',
        fields: {
            addAuthor: {
                type: AuthorType,
                args: {
                    //GraphQLNonNull make these field required
                    name: { type: new GraphQLNonNull(GraphQLString) },
                    age: { type: new GraphQLNonNull(GraphQLInt) }
                },
                resolve(parent, args) {
                    let author = new Author({
                        name: args.name,
                        age: args.age
                    });
                    return author.save();
                }
            },
            addBook: {
                type: BookType,
                args: {
                    name: { type: new GraphQLNonNull(GraphQLString) },
                    pages: { type: new GraphQLNonNull(GraphQLInt) },
                    authorID: { type: new GraphQLNonNull(GraphQLID) }
                },
                resolve(parent, args) {
                    let book = new Book({
                        name: args.name,
                        pages: args.pages,
                        authorID: args.authorID
                    })
                    return book.save()
                }
            }
        }
    });

    //Creating a new GraphQL Schema, with options query which defines query 
    //we will allow users to use when they are making request.

    return Schema;

})();
// module.exports = new GraphQLSchema({
//     query: RootQuery,
//     mutation: Mutation
// });

module.exports = {
    Schema: Schema,
    graphqlObj: new GraphQLSchema({
        query: RootQuery,
        mutation: Mutation
    })
};