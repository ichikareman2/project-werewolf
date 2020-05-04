# Werewolf Client

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.1. 

## Scripts
* `npm run start / yarn start` - starts the development server

* `npm run lint / yarn lint` - runs linting tool across all project files

## Routes
* `/`
  - home page, currently renders the form to join the game asking for user's player name
  - [next release] add option to create room

* `/lobby`
  - contains a list of all players in the game
  - if host, has the option to start game

* `/game`
  - actual game view
  - renders all players, current phase and instructions based on player's role

* `/roles`
  - list of roles currently supported

## Models
_This needs to be updated as the server models change_

### Role
```
name: string;
description: string;
image: string;
```
### Player
```
id: string;
aliasId: string;
name: string;
isHost: boolean;
role?: RolesEnum;
alive?: boolean;
causeOfDeath: string;
vote: Player;
voteCount: number;
```
### Lobby
```
players: Player[];
roomCode: string;
```
### Game
```
phase: GamePhase;
round: number;
players: Player[];
votes: Vote[]
alphaWolf?: string;
werewolfVote?: string;
seerPeekedAliasIds?: string[];
winner?: string;
```
### Vote
```
voterAliasId: string;
votedAliasId: string;
```

## Validations
* Player name
  - required
  - 4-8 character length
  - alphanumeric
* Lobby, Game
  - validate session, if exists

## Services
* Form Validation Services
  - contains validations methods used in forms
  - supports checking if string is alphanumeric
* API service
  - handles general HTTP client requests
  - supports `GET` and `POST` requests at the moment
* Local Storage Service
  - manages the `LocalStorage`
* Lobby Service
  - connects to the lobby socket service in the server
  - events include joining, starting and leaving game
* Player Service
  - handles player-related requests
* Game Service
  - handles all game-related methods

## Components
* Header
  - contains navigation links
* Join Game
  - asks for the player name
  - redirects to `/lobby`
* Lobby
  - uses `LobbyService`
  - list of players
  - button to start game, if host
  - redirects to `/game` on game start
* Game
  - uses `GameService`
  - list of players, both active and inactive
  - current game phase and round
  - instruction messagges based on game phase and role
* Roles
  - retrieves roles config data from server
  - displays role details
