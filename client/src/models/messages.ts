import { GamePhaseEnum } from './game';
import { RolesEnum } from './player';

const INSTRUCTION_MESSAGES = {
    [GamePhaseEnum.DAY]: {
        [RolesEnum.VILLAGER]: 'Discuss among yourselves and vote who you think is the werewolf.',
        [RolesEnum.WEREWOLF]: 'Discuss among yourselves and vote who you think is the werewolf.',
        [RolesEnum.SEER]: 'Discuss among yourselves and vote who you think is the werewolf.',
    },
    [GamePhaseEnum.NIGHT]: {
        [RolesEnum.VILLAGER]: 'It\'s been a day. Sleep tight.',
        [RolesEnum.WEREWOLF]: 'Who would you like to eliminate tonight?',
        [RolesEnum.SEER]: 'Whose role would you like to have a peak?'
    }
};

const PHASE_MESSAGES = {
    [GamePhaseEnum.DAY]: 'Day # in the Village',
    [GamePhaseEnum.NIGHT]: 'Night # in the Village'
};

const GAME_CONFIRMATION_MESSAGES = {
    [RolesEnum.VILLAGER]: 'Are you sure you want to vote this player out?',
    [RolesEnum.WEREWOLF]: 'Are you sure you want to eliminate this player?',
    [RolesEnum.SEER]: 'Are you sure you want to peek this player\'s role?',
};

const GAME_OVER_MESSAGES = {
    'Villager': 'The villagers won! Hooray!',
    'Werwolves': 'Oh no! Werewolves have taken over the village!'
};

export const getInstructionMessage = ( mode: GamePhaseEnum, role: RolesEnum ) => {
    return INSTRUCTION_MESSAGES[mode][role];
};

export const getPhaseMessage = ( mode: GamePhaseEnum, round: number ) => {
    return PHASE_MESSAGES[mode].replace('#', round.toString());
};

export const getConfirmationMessage = ( role: RolesEnum, playerName: string ) => {
    return GAME_CONFIRMATION_MESSAGES[role].replace('this player', playerName);
}

export const getGameOverMessage = ( winner: string ) => {
    return GAME_OVER_MESSAGES[winner];
}
