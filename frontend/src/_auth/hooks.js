import React, {
    createContext, useReducer, useEffect
} from 'react'
import { Cookies } from 'react-cookie'

import { reducer, handlerNames } from './dispatcher'

function useAuthValues() {
    const [state, dispatch] = useReducer(reducer, {
        user: undefined,
        isAdmin: undefined,
        csrfToken: undefined
    });

    useEffect(() => {
        fetch('/api/v2/get/auth/current-user')
            .then(resp => resp.ok ? resp.json() : resp.status)
            .then(data => {
                if ((typeof data) === Number) return;
                dispatch({ type: handlerNames.LOGIN, payload: { user: data.user, isAdmin: data.is_admin } });
            })
        
        
        fetch('/api/v2/get/auth/csrf-token')
            .then(resp => {
                if (resp.ok) {
                    dispatch({ type: handlerNames.SET_CSRF_TOKEN, payload: { csrfToken: resp.headers.get('X-CSRFToken') } });
                }
                return resp.status;
            })

    }, []);

    const setLoginCredentials = (user, isAdmin, csrfToken) => {
        dispatch({ type: handlerNames.LOGIN, payload: { user: user, isAdmin: isAdmin, csrfToken: csrfToken} });
    }

    const setLogoutCredentials = () => {
        dispatch({ type: handlerNames.LOGOUT, payload: '' });
    }

    return {
        ...state,
        setLoginCredentials,
        setLogoutCredentials
    };
}

export { useAuthValues };