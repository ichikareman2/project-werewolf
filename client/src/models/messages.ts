import { GamePhaseEnum } from './game-phase';
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
}

const PHASE_MESSAGES = {
    [GamePhaseEnum.DAY]: 'Day in the Village',
    [GamePhaseEnum.NIGHT]: 'Night in the Village'
}

export const getInstructionMessage = ( mode: GamePhaseEnum, role: RolesEnum ) => {
    return INSTRUCTION_MESSAGES[mode][role];
}

export const getPhaseMessage = ( mode: GamePhaseEnum ) => {
    return PHASE_MESSAGES[mode];
}
