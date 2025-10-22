import { NextServer, createServerRunner } from '@aws-amplify/adapter-nextjs';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth/server';
import { amplifyServerConfig } from './config/amplify.server.config';

export const { runWithAmplifyServerContext } = createServerRunner({
    config: amplifyServerConfig,
});

export async function authenticatedUser(context: NextServer.Context) {
    return await runWithAmplifyServerContext({
        nextServerContext: context,
        operation: async (contextSpec) => {
            try {
                const session = await fetchAuthSession(contextSpec);

                if (!session.tokens) {
                    return;
                }

                const user = await getCurrentUser(contextSpec);
                const attributes = session.tokens.idToken?.payload ?? null;

                if (user) {
                    return {
                        session,
                        user,
                        attributes,
                    };
                }
            } catch (e) {
                console.error(e);
            }

            return { session: null, user: null, attributes: null };
        },
    });
}
