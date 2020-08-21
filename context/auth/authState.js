import React, { useReducer } from 'react';
import authContext from './authContext';
import authReducer from './authReducer';
import {
    REGISTRO_EXITOSO,
    REGISTRO_ERROR,
    LIMPIAR_ALERTA,
    LOGIN_EXITOSO,
    LOGIN_ERROR,
    USUARIO_AUTENTICADO,
    CERRAR_SESION
} from '../../types';
import clienteAxios from './../../config/axios';
import tokenAuth from './../../config/tokenAuth';

const AuthState = ({ children }) => {

    const initialState = {
        token: typeof window !== 'undefined' ? localStorage.getItem('token') : '',
        autenticado: null,
        usuario: null,
        mensaje: null
    }

    const [state, dispatch] = useReducer(authReducer, initialState);

    const registrarUsuario = async datos => {

        try {
            const resp = await clienteAxios.post('/api/usuarios', datos);
            dispatch({
                type: REGISTRO_EXITOSO,
                payload: resp.data.msg
            });

        } catch (error) {
            console.log(error.response.data.msg);
            dispatch({
                type: REGISTRO_ERROR,
                payload: error.response.data.msg
            });
        }

        setTimeout(() => {
            dispatch({
                type: LIMPIAR_ALERTA
            });
        }, 3000);

    }

    const iniciarSesion = async datos => {

        try {
            const resp = await clienteAxios.post('/api/auth', datos);
            dispatch({
                type: LOGIN_EXITOSO,
                payload: resp.data.token
            });
        } catch (error) {
            console.log(error.response.data);
            dispatch({
                type: LOGIN_ERROR,
                payload: error.response.data.msg
            });
        }

        setTimeout(() => {
            dispatch({
                type: LIMPIAR_ALERTA
            });
        }, 3000);

    }

    const usuarioAutenticado = async () => {

        const token = localStorage.getItem('token');
        if (token) {
            tokenAuth(token);
        }

        try {
            const resp = await clienteAxios.get('/api/auth');
            if (resp.data.usuario) {
                dispatch({
                    type: USUARIO_AUTENTICADO,
                    payload: resp.data.usuario
                });
            }
        } catch (error) {
            console.log(error.response);
            dispatch({
                type: LOGIN_ERROR,
                payload: error.response.data.msg
            });
        }

        setTimeout(() => {
            dispatch({
                type: LIMPIAR_ALERTA
            });
        }, 3000);

    }

    const cerrarSesion = () => {
        dispatch({
            type: CERRAR_SESION
        });
    }

    return (
        <authContext.Provider
            value={{
                token: state.token,
                autenticado: state.autenticado,
                usuario: state.usuario,
                mensaje: state.mensaje,
                registrarUsuario,
                iniciarSesion,
                usuarioAutenticado,
                cerrarSesion
            }}
        >
            {children}
        </authContext.Provider>
    )
}

export default AuthState;