import requiredProp from '~/utils/requiredProp';

import createKeyboardManager from '~/controller/keyboard';
import createMouseManager from '~/controller/mouse';
import createDebugger from '~/controller/debugger';

export default function createController({
    store = requiredProp('store'),
    renderer = requiredProp('renderer'),
}) {
    const debug = createDebugger(store);
    const keyboard = createKeyboardManager(store);
    const mouse = createMouseManager(renderer);
    return {
        keyboard,
        mouse,
        debug,
        init: () => {
            keyboard.init();
            mouse.init(renderer);
        },
    };
}
