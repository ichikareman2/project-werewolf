
# Werewolf server

Implementation of api server for playing werewolf. Uses socket.io.

## How to use:
There are **namespaces** that a client can connect to. Those namespaces have **listeners** (`on`) and **emitters** (`emit`). 
* **listener** means the server waits for the client to emit certain messages. 
  * it is client's way to send data that is caused by user actions, to the server.
  ```javascript
    // connect to io with namespace "player"
    const socket = io('http://localhost:8000/player');
    // data to pass with "getPlayer" message
    const id = '0eabde82-d8af-44d0-9af2-50ed185865e0';
    // subscribe to messages "getPlayer"
    // pass `id`
    // pass a function `CallbackFn<T>` and expect an object
    socket.emit('getPlayer', id, (players) => {
        // do something to player once player is received.
        doSomething(players);
    });
  ```
* **emitter** means the server will send messages that the client will have to listen to, in order to receive.
  * this is the way to get updates from the server in real time.
  ```javascript
    // connect to io with namespace "lobby"
    const socket = io('http://localhost:8000/lobby');
    // listen to "playerList" message
    socket.on('playerList', (players) => {
        // do something everytime you get data from this message
        doSomething(players)
    });
  ```
There are also http endpoints available:
  * use this for operations that doesn't require real time.
  ```javascript
    await fetch(url.toString(), {
      method: 'post',
      body: JSON.stringify({
        name: 'test'
      }),
      headers: {
        'content-type': 'application/json; charset=utf-8'
      }
      }).then(x => x.json())
  ```
---

## API:
### `/player` HTTP Endpoint
#### Flow:
This is used to manage players. player endpoint is designed to accomodate the following flow:

1. Client checks if they have an id in their local store (localStorage for example).
2. If there is, [get the player data](#GET-`/player/:id`) from server using the id. Otherwise skip to step 5.
3. If client is able to get player data, then it means player has a record. Otherwise, skip to step 5.
4. store the data locally for the session. Proceed to step 7.

5. If client is not able to get player data, then the user will have to be prompted to create a player data. Only name is required to be sent.
6. When client gets a name, send a request to server to [create a player data](#POST-`/player`). This returns the player data which should be stored locally in client for the session.
7. Proceed to Lobby page

#### GET `/player/:id`
##### Path parameters
```typescript 
{
    id: string
}
```
##### Response : [Player](#player)

#### POST `/player`
##### Request Body
```typescript
 {
     name: string
 }
```
##### Response : [Player](#player)

### `/lobby` namespace
#### Flow:
This is used to manage lobby. lobby messages available are designed to accomodate the following flow:

1. Client, upon showing lobby page, should request to have its player [join the lobby](#`joinLobby`).
2. client should then subscribe to [lobby player messages](#`playerList`) to get other players in the lobby.
3. Client should also mark the current player in lobby and the host. Client can do this by matching the `Player`'s `aliasId` to the `aliasId` in the player list data and the host, by checking if `isHost` property is true.
4. If the user wants to leave the lobby, then the client should emit a [message to leave lobby](#`leaveLobby`-|-`disconnect`).

#### `/lobby` listeners
##### `joinLobby`
* emit this to join the lobby
* payload#1: `id` - id of player
  * string
* payload#2: `callbackFn` - not necessary, but you can use it to know if the operation is done.
  * [CallbackFn<void>](#callbackfn<t>)
##### `leaveLobby` | `disconnect`
* emit this to leave the lobby.
* `no payload`
#### `/lobby` emitters
##### `playerList`
* listen to this type of message to get lobby players
* type : [PublicLobbyPlayer](#PublicLobbyPlayer)

---
## Type Definitions
### Player 
* data about a player
#### Type : `Object`
#### Properties
Name | Type | Description
-----|------|------------
id | string | unique identifier. stored in browser
aliasId | string | identifier for when other players reference a player. For security reasons.
name | string | name of the player

### PublicLobbyPlayer
* lobby player data
#### Type : `Object`
#### Properties:
Name | Type | Description
-----|------|------------
aliasId | string | identifier for when other players reference a player. For security reasons.
name | string | name of player
isHost | boolean | if player theis host

### SuccessResponse<T>
#### Type : `Object`
#### Properties:
Name | Type | Description
-----|------|------------
data | T | successful response data

### FailedResponse
#### Type: `Object`
#### Properties:
Name | Type | Description
-----|------|------------
error | string | error message

### CallbackFn<T>
* function to provide when client is getting data through emit.
#### Type : `Function`
#### Parameters:
Name | Type | Description
---|---|---
data | FailedResponse | SuccessResponse<T>
#### Return : `void`


---

## TODO
1. ~~add start game to lobby~~ done
1. ~~mark host in lobby~~ done
1. complete readme
1. provide models referred to in this readme
1. provde sample code
1. ~~make game io~~
1. ~~make game data service~~
1. game implementation - 80% done