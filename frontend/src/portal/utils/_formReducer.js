const initialState = {
    hidePassword: true
};

const actionCode = {
    TOGGLE_VISIBLE: 'toggle-visible',
    TOGGLE_INVISIBLE: 'toggle-invisible'
};

const handlers = {};

handlers[actionCode.TOGGLE_VISIBLE] = (state) => ({ ...state, hidePassword: false });
handlers[actionCode.TOGGLE_INVISIBLE] = (state) => ({ ...state, hidePassword: true });

function reducer(state, action) {
    const handler = handlers[action.type];

    if (handler != undefined) {
        return handler(state);
    }

    return state;
}

export { actionCode, initialState, reducer };