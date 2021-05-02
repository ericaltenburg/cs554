import { gql } from '@apollo/client';

const GET_NEW_UNSPLASH_IMAGES = gql`
    query unsplashImages($pageNum: Int) {
        unsplashImages(pageNum: $pageNum) {
            id
            url
            description
            posterName
            binned
        }
    }
`;

const GET_ALL_BINNED_IMAGES = gql`
    query binnedImages {
        binnedImages {
            id
            url
            description
            posterName
            binned
        }
    }
`;

const GET_ALL_USER_IMAGES = gql`
    query userPostedImages {
        userPostedImages {
            id
            url
            description
            posterName
            binned
        }
    }
`;

const UPLOAD_IMAGE = gql`
    mutation uploadImage( 
        $url: String! 
        $posterName: String
        $description: String
    ) {
        uploadImage(url: $url, posterName: $posterName, description: $description) {
            id
        }
    }
`;

const UPDATE_IMAGE = gql`
    mutation updateImage(
        $id: ID!
        $userPosted: Boolean
        $url: String
        $posterName: String
        $description: String
    ) {
        updateImage(
            id: $id
            userPosted: $userPosted
            url: $url
            posterName: $posterName
            description: $description
        ) {
            id
            userPosted
            url
            posterName
            description
        }
    }
`;

const exportedObject = {
    GET_NEW_UNSPLASH_IMAGES,
    GET_ALL_BINNED_IMAGES,
    GET_ALL_USER_IMAGES,
    UPLOAD_IMAGE,
    UPDATE_IMAGE
};

export default exportedObject;