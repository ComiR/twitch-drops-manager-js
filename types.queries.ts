import {HashString} from './types.basic';

export interface Query
{
    operationName: string,
    extensions: {
        persistedQuery: {
            sha256Hash: HashString,
            version: 1,
        },
    },
    variables: {},
}
