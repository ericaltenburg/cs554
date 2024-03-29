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
const user_set = 'user_set';
const redis_sets = [binned_set, user_set];

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
            let imagePost = [];
            let result = null;

            if (!args.pageNum) {
                result = await axios.get(`https://api.unsplash.com/photos/?client_id=${accessKey}`);
            } else {
                checkIsProperPageNum(args.pageNum);
                result = await axios.get(`https://api.unsplash.com/photos/?client_id=${accessKey}&page=${args.pageNum}`)
            }

            result = result.data;

            for (let i = 0; i < result.length; i++) {
                indiv_photo = result[i];

                imagePost.push({
                    id: indiv_photo.id,
                    url: indiv_photo.urls.regular,
                    posterName: indiv_photo.user.name,
                    description: indiv_photo.alt_description,
                    userPosted: false,
                    binned: await client.hexistsAsync(binned_set, indiv_photo.id)
                });
            }

            return imagePost;
        },
        binnedImages: async () => {
            const binnedPosts = await client.hvalsAsync(binned_set);

            let imagePosts = [];

            for (let i = 0; i < binnedPosts.length; i++) {
                imagePosts.push(JSON.parse(binnedPosts[i]));
            }

            return imagePosts;
        },
        userPostedImages: async () => {
            const userPosts = await client.hvalsAsync(user_set);

            let imagePosts = [];
            for (let i = 0; i < userPosts.length; i++) {
                imagePosts.push(JSON.parse(userPosts[i]));
            }

            return imagePosts;
        }
    },
    Mutation: {
        uploadImage: async (_, args) => {
            const userPost = {
                id: uuid.v4(),
                url: args.url,
                posterName: args.posterName ? args.posterName : '',
                description: args.description ? args.description : '',
                userPosted: true,
                binned: false
            };

            await client.hsetAsync(user_set, userPost.id, JSON.stringify(userPost));
            return userPost;
        },
        updateImage: async (_, args) => {
            // New Image post just in case the binned image is an unsplashed image
            let newPost = {
                id: args.id
            }

            let binResponse = await client.hexistsAsync(binned_set,args.id);
            let userResponse = await client.hexistsAsync(user_set, args.id);
            let isUserAndBinned = binResponse && userResponse;

            // 0 for not in cache, 1 for bin, and 2 for user
            const cacheSet = (binResponse) ? 1 : ((userResponse) ? 2 : 0);

            let oldPost = '';

            if (cacheSet) {
                oldPost = await client.hgetAsync(redis_sets[cacheSet-1], args.id);
                oldPost = JSON.parse(oldPost);
            }

            newPost.url = !args.url ? (!oldPost.url ? '' : oldPost.url) : args.url;
            newPost.posterName = !args.posterName ? (!oldPost.posterName ? '' : oldPost.posterName) : args.posterName;
            newPost.description = !args.description ? (!oldPost.description ? '' : oldPost.description) : args.description;
            newPost.userPosted = (args.userPosted === undefined) ? ((oldPost.userPosted === undefined) ? false : oldPost.userPosted) : args.userPosted;
            newPost.binned = (args.binned === undefined) ? ((oldPost.binned === undefined) ? false : oldPost.binned) : args.binned;
            let stringNewPost = JSON.stringify(newPost);

            // Cases:
            // unsplashed being binned cs = 0
            // unsplashed being unbinned cs = 1
            // user being binned cs = 2
            // user being unbinned cs = 1

            if (cacheSet === 1 && !newPost.binned) { // Unbin the image (case 2 and 4)
                await client.hdelAsync(binned_set, args.id);

                if (isUserAndBinned) {
                    await client.hdelAsync(user_set, args.id);
                    await client.hsetAsync(user_set, args.id, stringNewPost);
                }
            } else if ((cacheSet === 0 || cacheSet === 2) && newPost.binned) { // User post has to get binned
                if (cacheSet === 2) { // update the user set cache with the new image
                    await client.hdelAsync(user_set, args.id);
                    await client.hsetAsync(user_set, args.id, stringNewPost);
                }
                await client.hsetAsync(binned_set, args.id, stringNewPost);
            }

            return newPost;
        },
        deleteImage: async (_, args) => {
            if (!(await client.hexistsAsync(user_set, args.id))) {
                throw new UserInputError("Error: id does not exist");
            }
            let deletedPost = await client.hgetAsync(user_set, args.id);
            deletedPost = JSON.parse(deletedPost);
            if (deletedPost) {
                await client.hdelAsync(user_set, args.id);

                let deletedBinned = await client.hgetAsync(binned_set, args.id);
                deletedBinned = JSON.parse(deletedBinned);
                if (deletedBinned) {
                    await client.hdelAsync(binned_set, args.id);
                }
                deletedPost.userPosted = false;
                deletedPost.binned = false;
            }

            return deletedPost;
        }
    }
};


const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`GME 🚀  Server ready at ${url} GME 🚀`);
});