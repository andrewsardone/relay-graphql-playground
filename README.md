# Relay & GraphQL Playground

This is a running collection of my tinkering with Relay and GraphQL, [duh].

[duh]: http://media3.giphy.com/media/7wHsy05zMj076/giphy.gif

## Resources

- [chentsulin/awesome-graphql](https://github.com/chentsulin/awesome-graphql)
- Pinboard
   - [`relay`](https://pinboard.in/u:andrewsardone/t:relay/)
   - [`graphql`](https://pinboard.in/u:andrewsardone/t:graphql/)

## Thoughts Scratchpad

- Mutations, fat queries, and optimistic updates
    - via: [_Initial Impressions on GraphQL & Relay_][iiogr]
        - Good thoughts on [handling the dependencies of mutation changes on
          the server][iiogrmut]
        - [GitHub discussion][ghdgfq] on “the bulkiness” of `getFatQuery()`

[iiogr]: https://kadira.io/blog/graphql/initial-impression-on-relay-and-graphql
[iiogrmut]: https://kadira.io/blog/graphql/initial-impression-on-relay-and-graphql#how-relay-handles-mutation-changes
[ghdgfq]: https://github.com/facebook/relay/issues/125
