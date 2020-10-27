const graphql = require('graphql');
const bcrypt = require('bcryptjs');
var passport = require('passport');
const config = require('config');
const jwt = require('jsonwebtoken')
var nodemailer = require('nodemailer');
const axios = require('axios')
const dbconfig = config.get('nodemailer_auth');
const fs = require('fs');
const { reject } = require('async');
const unirest = require('unirest')
// const Book = require('../models/book');
// const Author = require('../models/Author');

const {
    GraphQLObjectType, GraphQLString,
    GraphQLID, GraphQLInt, GraphQLSchema,
    GraphQLList, GraphQLNonNull
} = graphql;
let RootQuery, Mutation
Schema = (function (wagner) {
    var global_wagner;

    function Schema(wagner) {
        global_wagner = wagner;
    }

    const storeFS = ({ stream, filename }) => {
        const uploadDir = '../../public/photos';
        const path = `${uploadDir}/${filename}`;
        return new Promise((resolve, reject) =>
            stream
                .on('error', error => {
                    if (stream.truncated)
                        // delete the truncated file
                        fs.unlinkSync(path);
                    reject(error);
                })
                .pipe(fs.createWriteStream(path))
                .on('error', error => reject(error))
                .on('finish', () => resolve({ path }))
        );
    }

    async function authCheck(req) {
        // return new Promise(function(resolve, reject) {
        const authorizationHeaader = req.headers.authorization;
        let result;
        if (authorizationHeaader) {
            const token = req.headers.authorization.split(' ')[1]; // Bearer <token>
            const options = {
                expiresIn: '1hr'
            };
            try {
                // verify makes sure that the token hasn't expired and has been issued by us
                result = jwt.verify(token, "privatekey");

                // Let's pass back the decoded token to the request object
                // req.decoded = result;
                return result
                // We call next to pass execution to the subsequent middleware
                next();
            } catch (err) {
                // Throw an error just in case anything goes wrong with verification
                throw new Error(err);
            }
        } else {
            return false
        }
        // })
    }

    const AuthorType = new GraphQLObjectType({
        name: 'Author',
        fields: () => ({
            email_id: { type: GraphQLString },
            password: { type: GraphQLString },
            full_name: { type: GraphQLString },
            city: { type: GraphQLString },
            authToken: { type: GraphQLString },
        })
    })

    const BookType = new GraphQLObjectType({
        name: 'Book',
        fields: () => ({
            id: { type: GraphQLString },
            name: { type: GraphQLString },
            pages: { type: GraphQLString },
        })
    })

   
    //RootQuery describe how users can use the graph and grab data.
    //E.g Root query to get all authors, get all books, get a particular 
    //book or get a particular author.
    RootQuery = new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
            getAllBooks: {
                type: new GraphQLList(BookType),
                async resolve(parent, args) {
                    return new Promise(async function (resolve, reject) {
                        try {
                            let Book = global_wagner.get("Book")
                            let books = await Book.find();
                            resolve(books)
                        } catch (err) {
                            reject(err)
                        }
                    })
                }
            },
            signin: {
                type: AuthorType,
                args: {
                    email_id: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    password: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                async resolve(parent, args) {
                    return new Promise(async function (resolve, reject) {
                        let User = global_wagner.get("Persons")
                        const user = await User.findOne({ email_id: args.email_id });
                        console.log(user)
                        if (!user) {
                            reject({ message: 'User does not exist!' });
                        }
                        const isEqual = await bcrypt.compare(args.password, user.password);
                        if (!isEqual) {
                            reject({ message: 'Password is incorrect!' });
                        }
                        const token = jwt.sign(
                            { userId: user.id },
                            'privatekey',
                            {
                                expiresIn: '1h'
                            }
                        );
                        user.authToken = token
                        await user.save()
                        resolve(user)
                    })
                }
            },
            resetPassword: {
                type: GraphQLString,
                args: {
                    //GraphQLNonNull make these field required
                    email_id: { type: new GraphQLNonNull(GraphQLString) },
                },
                resolve(parent, args, req, res) {
                    return new Promise(async function (resolve, reject) {
                        try {
                            var Persons = global_wagner.get("Persons");
                            let user = await Persons.findOne({ email_id: args.email_id })
                            if (user) {
                                var token = jwt.sign({
                                    _id: user._id
                                }, 'privatekey', { expiresIn: '1h' });
                                var transporter = nodemailer.createTransport({
                                    host: 'smtp.gmail.com',
                                    port: 465,
                                    secure: false,
                                    requireTLS: true,
                                    service: 'gmail',
                                    auth: {
                                        user: dbconfig.user,
                                        pass: dbconfig.pass
                                    }
                                });
                                const mailOptions = {
                                    from: dbconfig.user,
                                    to: args.email_id,
                                    subject: 'Password Reset Request',
                                    html: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                                        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                                        'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                                        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                                }

                                let sendmail = await transporter.sendMail(mailOptions)
                                if (sendmail) {
                                    resolve("Reset Password link has been sent to your registered email address. ")
                                }
                            } else {
                                reject({ message: "User not found" })
                            }
                        } catch (err) {
                            console.log(err)
                            reject(err)
                        }
                    });
                }
            },
        }
    });

    //Very similar to RootQuery helps user to add/update to the database.
    Mutation = new GraphQLObjectType({
        name: 'Mutation',
        fields: {
            signup: {
                type: AuthorType,
                args: {
                    //GraphQLNonNull make these field required
                    email_id: { type: new GraphQLNonNull(GraphQLString) },
                    password: { type: new GraphQLNonNull(GraphQLString) },
                    full_name: { type: new GraphQLNonNull(GraphQLString) },
                    city: { type: new GraphQLNonNull(GraphQLString) }
                },
                resolve(parent, args) {
                    return new Promise(async function (resolve, reject) {
                        try {
                            let User = global_wagner.get("Persons")
                            console.log(args)
                            const existingUser = await User.findOne({ email_id: args.email_id });
                            if (existingUser) {
                                reject({ message: "User already exists." })
                            }
                            const hashedPassword = await bcrypt.hash(args.password, 12);

                            let payload = {
                                email_id: args.email_id,
                                password: hashedPassword,
                                full_name: args.full_name,
                                city: args.city
                            }
                            const result = await User.create(payload)
                            var token = jwt.sign({
                                _id: result._id
                            }, 'privatekey', { expiresIn: '1h' });
                            var transporter = nodemailer.createTransport({
                                host: 'smtp.gmail.com',
                                port: 465,
                                secure: false,
                                requireTLS: true,
                                service: 'gmail',
                                auth: {
                                    user: dbconfig.user,
                                    pass: dbconfig.pass
                                }
                            });
                            let link = 'http://localhost:3001/verify/' + token
                            const mailOptions = {
                                from: dbconfig.user,
                                to: args.email_id,
                                subject: 'Password Reset Request',
                                html: 'You are receiving this because you (or someone else) have requested the verification of the email for your account.\n\n' +
                                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                                    link +
                                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                            }
                            let sendmail = await transporter.sendMail(mailOptions)
                            if (sendmail) {
                                resolve(result)
                            }
                        } catch (err) {
                            reject(err)
                        }
                    })
                }
            },
            changePassword: {
                type: AuthorType,
                args: {
                    password: { type: new GraphQLNonNull(GraphQLString) },
                },
                async resolve(parent, args, req, res) {
                    return new Promise(async function (resolve, reject) {
                        let auth = await authCheck(req)
                        if (!auth) {
                            reject({ message: "Please provide a token" })
                        } else {
                            let User = global_wagner.get("Persons")
                            let user = await User.findOne({ _id: auth.userId })
                            console.log(user)
                            if (user == null) {
                                reject({ message: "No user found" })
                            } else {
                                const hashedPassword = await bcrypt.hash(args.password, 12);
                                user.password = hashedPassword
                                await user.save()
                                resolve(user)
                            }
                        }
                    })
                }
            },
            editProfile: {
                type: AuthorType,
                agrs: {
                    email_id: { type: new GraphQLNonNull(GraphQLString) },
                    password: { type: new GraphQLNonNull(GraphQLString) },
                    full_name: { type: new GraphQLNonNull(GraphQLString) },
                    city: { type: new GraphQLNonNull(GraphQLString) },
                    profile_pic: { type: new GraphQLNonNull(GraphQLString) },
                    file: { type: new GraphQLNonNull(GraphQLString) }
                },
                async resolve(parent, args) {
                    const { filename, mimetype, createReadStream } = await args.file;
                    const stream = createReadStream();
                    const pathObj = await storeFS({ stream, filename });
                    const fileLocation = pathObj.path;
                    let auth = await authCheck(req)
                    if (!auth) {
                        reject({ message: "Please provide a token" })
                    } else {
                        let User = global_wagner.get("Persons")
                        let user = await User.findOne({ _id: auth.userId })
                        console.log(user)
                        if (user == null) {
                            reject({ message: "No user found" })
                        } else {
                            user.profile_pic = fileLocation
                            await user.save()
                            resolve(user)
                        }
                    }
                }
            },
            addBook: {
                type: BookType,
                args: {
                    //GraphQLNonNull make these field required
                    name: { type: new GraphQLNonNull(GraphQLString) },
                    pages: { type: new GraphQLNonNull(GraphQLString) },
                },
                resolve(parent, args) {
                    return new Promise(async function (resolve, reject) {
                        try {
                            let auth = await authCheck(req)
                            if (!auth) {
                                reject({ message: "Please provide a token" })
                            } else {
                                let payload = {
                                    name: args.name,
                                    pages: args.pages
                                }
                                let Books = global_wagner.get("Book")
                                let check = await Books.findOne({ name: args.name })
                                console.log(check)
                                if (check != null) {
                                    reject({ message: "Book already exists." })
                                } else {
                                    let book = new Books(payload)
                                    await book.save()
                                    resolve(book)
                                }
                            }
                        } catch (err) {
                            reject(err)
                        }
                    })
                }
            },
            editBook: {
                type: BookType,
                args: {
                    //GraphQLNonNull make these field required
                    id: { type: new GraphQLNonNull(GraphQLString) },
                    name: { type: new GraphQLNonNull(GraphQLString) },
                    pages: { type: new GraphQLNonNull(GraphQLString) },
                },
                resolve(parent, args, req) {
                    return new Promise(async function (resolve, reject) {
                        try {
                            let auth = await authCheck(req)
                            if (!auth) {
                                reject({ message: "Please provide a token" })
                            } else {
                                let Books = global_wagner.get("Book")
                                let book = await Books.findOne({ _id: args.id })
                                if (book == null) {
                                    reject({ message: "Book does not exists." })
                                } else {
                                    book.name = args.name
                                    book.pages = args.pages
                                    await book.save()
                                    resolve(book)
                                }
                            }
                        } catch (err) {
                            reject(err)
                        }
                    })
                }
            },
            deleteBook: {
                type: GraphQLString,
                args: {
                    //GraphQLNonNull make these field required
                    id: { type: new GraphQLNonNull(GraphQLString) },
                },
                resolve(parent, args, req) {
                    return new Promise(async function (resolve, reject) {
                        try {
                            let auth = await authCheck(req)
                            if (!auth) {
                                reject({ message: "Please provide a token" })
                            } else {
                                let Books = global_wagner.get("Book")
                                let book = await Books.findOne({ _id: args.id })
                                if (book == null) {
                                    reject({ message: "Book does not exists." })
                                } else {
                                    await Books.deleteOne({ _id: args.id });
                                    resolve("Book deleted successfully.")
                                }
                            }
                        } catch (err) {
                            reject(err)
                        }
                    })
                }
            },
            socialLogin: {
                type: AuthorType,
                args: {
                    token: { type: new GraphQLNonNull(GraphQLString) },
                    loginType: { type: new GraphQLNonNull(GraphQLString) },
                    fbEmail: { type: GraphQLString },   
                },
                resolve(parent, args, req) {
                    return new Promise(async function (resolve, reject) {
                        let url = null, type = null, access_token = null, response = {};
                        if (args.loginType === 'google') {
                            url = 'https://oauth2.googleapis.com/tokeninfo?id_token=';
                            type = 'google';
                        } else if (args.loginType === 'facebook') {
                            url = 'https://graph.facebook.com/v2.5/me?fields=email,name,friends&access_token=';
                            type = 'facebook';
                        } else {
                            reject('invalid type');
                        }


                        await axios.get(url + args.token).then(async data => {
                            console.log("Data == ", data.data)
                            if (!data.data.email) {
                                reject('Please provide email access');
                            } 
    
                            var User = global_wagner.get("Persons")
                            let user = await User.findOne({ email_id: data.data.email })
                            if (user) {
                                const token = jwt.sign(
                                    { userId: user.id },
                                    'privatekey',
                                    {
                                        expiresIn: '1h'
                                    }
                                );
                                user.authToken = token
                                await user.save()
                                console.log("If", user)
                                resolve(user);
                            }
                            else {
                                let payload = {
                                    email_id: data.data.email,
                                    password: "qwerty",
                                    full_name: data.data.name,
                                    authToken: token
                                }
                                const result = await User.create(payload)
                                console.log("Result", result)
                                resolve(result)
                            }
                        }).catch(err => {
                            console.log("Error = ", err)
                        })
                    })
                }
            }
        }
    });

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