'use client';
import { Amplify } from 'aws-amplify';
import { amplifyServerConfig } from './amplify.server.config';

export const amplifyConfig = amplifyServerConfig;

Amplify.configure(amplifyConfig, { ssr: true });

export default function ConfigureAmplifyClientSide() {
    return null;
}
