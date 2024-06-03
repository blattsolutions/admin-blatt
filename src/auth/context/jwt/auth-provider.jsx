import PropTypes from 'prop-types';
import {useMemo, useEffect, useReducer, useCallback} from 'react';

import axios, {endpoints} from 'src/utils/axios';

import {AuthContext} from './auth-context';
import {setSession, isValidToken} from './utils';
import {HOST_API} from "../../../config-global.js";

// ----------------------------------------------------------------------
/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */
// ----------------------------------------------------------------------

const initialState = {
  user: null,
  loading: true,
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

const STORAGE_KEY = 'token';

export function AuthProvider({children}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      let accessToken = sessionStorage.getItem(STORAGE_KEY);
      const refreshToken = localStorage.getItem("refreshToken");
      if (!accessToken && refreshToken) {
        const response = await axios.post(`${HOST_API}${endpoints.auth.refreshToken}`, {
          refresh_token:refreshToken,
        });
        accessToken = response.data.access_token;
        sessionStorage.setItem('token', accessToken);
      }
      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);
        const username = localStorage.getItem('username')
        const response = await axios.post(endpoints.auth.me, {
          username
        });

        const {user} = response.data;

        dispatch({
          type: 'INITIAL',
          payload: {
            user: {
              ...user,
              accessToken,
            },
          },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: {
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (email, password) => {
    const data = {
      username: email,
      password,
    };

    const response = await axios.post(endpoints.auth.login, data);
    const {access_token, user, refresh_token} = response.data;
    localStorage.setItem('refreshToken', refresh_token)
    localStorage.setItem('username', email)
    setSession(access_token);

    dispatch({
      type: 'LOGIN',
      payload: {
        user: {
          ...user,
          accessToken: access_token,
        },
      },
    });
  }, []);

  // REGISTER
  const register = useCallback(async (email, password, firstName, lastName) => {
    const data = {
      email,
      password,
      firstName,
      lastName,
    };

    const response = await axios.post(endpoints.auth.register, data);

    const {accessToken, user} = response.data;

    sessionStorage.setItem(STORAGE_KEY, accessToken);

    dispatch({
      type: 'REGISTER',
      payload: {
        user: {
          ...user,
          accessToken,
        },
      },
    });
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    dispatch({
      type: 'LOGOUT',
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      register,
      logout,
    }),
    [login, logout, register, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
