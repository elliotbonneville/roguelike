export default function store(reducer, initialState = {}) {
    const listeners = {};
    let state = initialState;
    
    const getState = () => state;

    const dispatch = (action) => {
        const previousState = state;
        state = reducer(state, action);
        
        const actionListeners = listeners[action.type];
        if (actionListeners) {
            actionListeners.forEach(
                listener => listener(action, state, previousState),
            );
        }
    };

    const listen = (actions, callback) => {
        actions.forEach((actionType) => {
            // create a listener for each action using the callback
            listeners[actionType] = [
                ...(listeners[actionType] || []),
                callback,
            ];
        });

        // return a function to remove all of the listeners just created
        return () => actions.forEach(actionType => {
            listeners[actionType] = listeners[actionType].filter(
                actionListener => actionListener !== callback,
            );
        });
    };

    dispatch({ type: 'INIT' });
    return { getState, dispatch, listen };
}
