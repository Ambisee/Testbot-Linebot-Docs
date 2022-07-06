const handlers = {}
const handlerNames = {
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    SET_CSRF_TOKEN: 'SET_CSRF_TOKEN'
}


handlers[handlerNames.LOGIN] = (state, action) => ({...state, user: action.payload.user, isAdmin: action.payload.is_admin })
handlers[handlerNames.LOGOUT] = (state, action) => ({ ...state, user: undefined, isAdmin: undefined })
handlers[handlerNames.SET_CSRF_TOKEN] = (state, action) => ({...state, csrfToken: action.payload.csrfToken})


function reducer(state, action) {
    const handler = handlers[action.type];
    if (handler === undefined) return state;
    return handler(state, action)
}

export { reducer, handlerNames };