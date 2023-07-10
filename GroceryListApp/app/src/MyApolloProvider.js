import { ApolloClient, ApolloLink, ApolloProvider, HttpLink, InMemoryCache } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { useMemo } from "react";


export const MyApolloProvider = ({ children, showError }) => {
    const apolloClient = useMemo(
        () => new ApolloClient({
            cache: new InMemoryCache(),
            link: ApolloLink.from([
            onError(({ graphQLErrors, networkError }) => {
                console.log("ApolloClient invoked onError");
                if (networkError) {
                console.warn("Network error: " + networkError);
                showError("Network Error");
                } else if (graphQLErrors) {
                graphQLErrors.forEach(({ message, locations, path}) => {
                    console.warn(`GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`);
                    showError("Error: " + message);
                });
                }
            }),
            new HttpLink({ uri: 'http://localhost:8000/graphql' }),
            ]),
        }),
        [showError]
    );

    return (
        <ApolloProvider client={apolloClient}>
            {children}
        </ApolloProvider>
    )
}