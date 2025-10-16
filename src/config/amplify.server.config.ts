import type { ResourcesConfig } from 'aws-amplify';

export const amplifyServerConfig: ResourcesConfig = {
    Auth: {
        Cognito: {
            userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID!,
            userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID!,
            loginWith: {
                oauth: {
                    domain: process.env.NEXT_PUBLIC_OAUTH_DOMAIN!,
                    scopes: ['email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
                    redirectSignIn: [process.env.NEXT_PUBLIC_REDIRECT_SIGN_IN!],
                    redirectSignOut: [process.env.NEXT_PUBLIC_REDIRECT_SIGN_OUT!],
                    responseType: 'code' as const,
                },
                username: true,
                email: true,
            },
        },
    },
};
