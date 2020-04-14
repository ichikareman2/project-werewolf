
# Werewolf server

Simple implementation of api server for playing werewolf. Uses socket.io.

## Socket namespaces

There are 2 (as of writing) namespaces a client can connect to.

### /player

This is used to manage players. player messages available are designed to accomodate the following flow:

1. Client checks if they have an id in their local store (localStorage for example). Otherwise, skip to step 5.
2. If there is, get the player data from server using the id. Otherwise skip to step 5.
3. If client is able to get player data, then it means player has a record. Otherwise, skip to step 5.
4. store the data locally for the session. Proceed to step 7.

5. If client is not able to get player data, then the user will have to be prompted to create a player data. Only name is required to be sent.
6. When client gets a name, send a request to server to create a player data. This returns the player data which should be stored locally in client for the session.
7. Proceed to Lobby page

#### `createPlayer` message
    payload 1: name - player's name
    payload 2: callback function with parameter of object with `data` that is of type `Player` or `error` with type string.
#### `getPlayer` message
    payload 1: id - guid id
    payload 2: callback function with parameter of object with `data` that is of type `Player` or `error` with type string.

### /lobby

This is used to manage lobby. lobby messages available are designed to accomodate the following flow:

1. Client, open showing lobby page, should request to have its player join the lobby.
2. On callback, meaning the player has joined the lobby, client should subscribe to lobby player messages to get other players in the lobby.
3. Client should also mark the current player in lobby. Client can do this by matching the `Player`'s `aliasId` to the `aliasId` in the player list data.







## TODO
1. add start game to lobby
1. mark host in lobby
1. complete readme
1. provide models referred to in this readme
1. provde sample code