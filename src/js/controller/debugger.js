import enterDebug from '~/model/features/status/enterDebug.action';
import leaveDebug from '~/model/features/status/leaveDebug.action';

export default function createDebugger(store) {
    return {
        start: () => {
            store.dispatch(enterDebug());
        },
        stop: () => {
            store.dispatch(leaveDebug());
        }
    };
}
