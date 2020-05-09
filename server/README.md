
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
##### Response : [`Player`](#player)

#### POST `/player`
##### Request Body
```typescript
 {
    name: string
 }
```
##### Response : [`Player`](#player)

#### POST `/player`
##### Request Body
```typescript
 {
    id: string,
    name: string
 }
```
##### Response : [`Player`](#player)

### `/lobby` namespace
#### Flow:
This is used to manage lobby. lobby messages available are designed to accomodate the following flow:

1. Client, upon showing lobby page, should subscribe to:
   * Lobby player messages [`"playerList"`](#playerList) to get players in the lobby [`PublicLobbyPlayer`](###PublicLobbyPlayer) when it emits.
   * game started event [`"gameStarted"`](#gameStarted) to know when the game has started. When the client receives this, it should move client to game page.
2. Client should then request to have its player join the lobby by emitting [`"joinLobby"`](#`joinLobby`).
    * Client should mark the current player in lobby by matching the [`PublicLobbyPlayer.aliasId`](#PublicLobbyPlayer) with the current player's [`Player.aliasId`](#player).
    * Client should mark the current host player by looking for lobby player with `isHost` set to `true`.
3. When lobby has enough players, the current host should be able to start the game by emitting [`gameStart`](#gameStart). If successful, all players including host will receive the [`"gameStarted"`](##`gameStarted`) message
4. If the user wants to leave the lobby, then the client should emit the message to leave lobby [`"leaveLobby"`](#`leaveLobby`-|-`disconnect`).

#### `/lobby` listeners
##### `joinLobby`
* emit this to join the lobby
* payload#1: `id` - id of player
  * string
* payload#2: [`CallbackFn<void>`](#callbackfn<t>) - not necessary, but you can use it to know if the operation is done.
##### `gameStart`
* emit this to start the game with the current players.
* payload#1: [`CallbackFn<void>`](#callbackfn<t>) - not necessary, but you can use it to know if the operation is done.
##### `leaveLobby` | `disconnect`
* emit this to leave the lobby.
* `no payload`
#### `/lobby` emitters
##### `playerList`
* listen to this type of message to get lobby players
* type : [`PublicLobbyPlayer`](#PublicLobbyPlayer)
##### `gameStarted`
* when this message is emitted, it means the host has started the game and the player should redirect to game page. The host who started the game will also receive if successful.

### `/game` namespace
#### Flow:
This is used to manage the ongoing game. game messages available are designed to accomodate the folliwing flow:
1. Client, upon showing game page, should listen to:
    * [`"gameUpdated"`](#`gameUpdated`) which is how the client can keep updated to the current state of game.
2. The game is already playable even before any player joins the game. When a player votes, the client should send [`"vote"`](#`vote`) message with the player's id and the voted's aliasId.
    * vote is used whenever a player of any role has to choose a player.
    * The votable players can be determined by using `role` and `isAlive` properties.
    * The game is over by checking if `winner` property is not empty.

#### `/game` listeners
##### `joinGame`
* emit this to join the game. listen to [`"gameUpdated"`](#`gameUpdated`) before sending to get the current state of game immediately.
* payload#1: id - id of the player that wants to join.
* payload#2: [`CallbackFn<void>`](#callbackfn<t>) - optional. Use it to know if the operation is successful.
##### `vote`
* emit this when player votes for a player. This is used by all roles to choose.
* payload#1: id - id of the player that wants to vote. Not aliasId
* payload#2: aliasId - aliasId of the player that the voter has voted for.
* payload#3: [`CallbackFn<void>`](#callbackfn<t>) - optional. Use it to know if the operation is successful.
##### `leaveGame`
* emit this to leave the game. The game will still continue except when the player's vote is required.
##### `restartGame`
* emit this to restart game with same players. The server will then emit [`gameRestarted`](#`gameRestarted`). Only host can do this.
* payload#1: id - id of the player that wants to vote. T
* payload#3: [`CallbackFn<void>`](#callbackfn<t>) - optional. Use it to know if the operation is successful.
#### `/game` emitters
##### `gameUpdated`
* Emitted everytime the game state changes.
* type : [`Game`](#Game)
##### `gameRestarted`
* Emitted when game is restarted.

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

### Game
* Game state
#### Type : `Object`
#### Properties:
Name | Type | Description
-----|------|------------
players | GamePlayer[] | players in game
phase | GamePhase | current phase of game
round | number | current round in game
votes | Vote[] | votes for the current phase/round
winner | "Villager" \| "Werewolves" \| undefined | if not undefined, the game is over.
werewolfVote | string | `aliasId` of the player the alphawolf voted
seerVote | string | `aliasId` of the player the seer peeked on.
seerPeekedAliasIds | string[] | aliasIds of the players that the seer has peeked on
alphaWolf | string | `aliasId` of the werewolf player that is assigned as alpha wolf

### GamePlayer
* model of player objects in game
#### Type : `Object`
#### Properties:
Name | Type | Description
-----|------|------------
aliasId | string | aliasId of the player
name | string | name of the player
isAlive | boolean | indicator if player is alive
causeOfDeath | string | cause of death
role | "Villager" \| "Werewolf" \| "Seer" | role that the player plays in game
isHost | boolean | indicator if player is host
### GamePhase
Name | Type | Description
-----|------|------------
dayOrNight | "Day" \| "Night" | if day or night
roundPhase | "Villagers Vote" \| "Werewolves Hunt" \| "Seer Peek" | Current round. Do not use. Obsolete.
### Vote
Name | Type | Description
----|------|------------
voterAliasId | string | `aliasId` of the voter
votedAliasId | string | `aliasId` of the voted

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
1. ~~complete readme~~ done?
1. ~~provide models referred to in this readme~~ done
1. ~~provde sample code~~ won't do anymore
1. ~~make game io~~ done
1. ~~make game data service~~ done