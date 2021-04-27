const bluebird = require('bluebird');
const { ApolloServer, gql, UserInputError, ApolloError } = require('apollo-server');
const uuid = require('uuid');
const redis = require('redis');
const client = redis.createClient();
const axios = require('axios');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

var accessKey = 'd58BiKKTPkanrMFXpVKNXfkoHyN5t8NFOObxttyhZ8I';
var secretKey = 'pDWaM0dz6p515-4CSBsGlc6XKOJBzxPif2Gu-YBeg84'; // Super duper secret api key (that i'm pushing to github lol)

const binned_set = 'binned_set';

// Create the type definitions for the query and our data
const typeDefs = gql`
    type Query {
        unsplashImages(pageNum: Int): [ImagePost]
        binnedImages: [ImagePost]
        userPostedImages: [ImagePost]
    }

    type ImagePost {
        id: ID!
        url: String!
        posterName: String!
        description: String
        userPosted: Boolean!
        binned: Boolean!
    }

    type Mutation {
        uploadImage(
        url: String!
        description: String
        posterName: String
        ): ImagePost
        updateImage(
            id: ID!
            url: String
            posterName: String
            description: String
            userPosted: Boolean
            binned: Boolean
            ): ImagePost
        deleteImage(
            id: ID!
        ): ImagePost
    }
`;

/**
 * Checks to make sure the page is valid
 * Idk if this is needed but Imma do it anyway
 * @param {Number} pageNum 
 */
const checkIsProperPageNum = (pageNum) => {
    if (pageNum === undefined || pageNum === null) throw new UserInputError("Error: pageNum does not exist");
    if (typeof pageNum !== 'number') throw new UserInputError(`Error: ${pageNum} is not of type Number`);
    if (pageNum < 0) throw new UserInputError('The page number must be positive and greater than 0');
}

/*
    Putting these here so I don't have to keep flipping through chrome tabs to look
    at the graphql example
*/

/*  parentValue - References the type def that called it
    so for example when we execute numOfEmployees we can reference
    the parent's properties with the parentValue Paramater
*/

/*  args - Used for passing any arguments in from the client
    for example, when we call 
    addEmployee(firstName: String!, lastName: String!, employerId: Int!): Employee
*/

const resolvers = {
    Query: {
        unsplashImages: async (_, args) => {
            let result = null;
            if (!args.pageNum) {
                result = await axios.get(`https://api.unsplash.com/photos/?client_id=${accessKey}`);
            } else {
                checkIsProperPageNum(args.pageNum);
                result = await axios.get(`https://api.unsplash.com/photos/?client_id=${accessKey}&page=${args.pageNum}`)
            }

            result = result.data;

            let imagePost = [];

            for (let i = 0; i < result.length; i++) {
                let value = result[i];
                let indivPost = {
                    id: value.id,
                    url: value.urls.regular,
                    posterName: value.user.name,
                    description: value.alt_description,
                    userPosted: false,
                    binned: await client.existsAsync(value.id)
                };
                imagePost.push(indivPost);
            }

            return imagePost;
        }
    }
};


const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url} 🚀`);
});