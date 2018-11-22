export function getStatus(state) {
    return state.status;
}

export function getGameStatus(state) {
    return getStatus(state).gameStatus;
}

export function getDebugging(state) {
    return getStatus(state).debugging;
}
