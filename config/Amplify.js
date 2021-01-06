export default {
    Auth: {
        // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
        // identityPoolId: '',
        identityPoolId: '',

        // REQUIRED - Amazon Cognito Region
        region: 'eu-west-2',

        // OPTIONAL - Amazon Cognito Federated Identity Pool Region
        // Required only if it's different from Amazon Cognito Region
        // identityPoolRegion: 'eu-west-2',

        // OPTIONAL - Amazon Cognito User Pool ID
        userPoolId: '',

        // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
        userPoolWebClientId: '',

        // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
        mandatorySignIn: false,
    },
    Storage: {
        AWSS3: {
            bucket: '', // REQUIRED -  Amazon S3 bucket
            region: 'eu-west-2', // OPTIONAL -  Amazon service region
        },
    },
}