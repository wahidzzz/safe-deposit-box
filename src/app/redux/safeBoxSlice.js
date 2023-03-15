import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import env from '../../app/env';
import globals from '../../app/consts/conf';
const initialState = {
    savedPassword: '',
    password: '',
    lock: false,
    status: 'Ready',
    idle: true,
    serviceMode: false,
    sn: '4815162342',
    loading: false,
}
export const validateMasterCode = createAsyncThunk(
    'depositBox/validateMasterCode',
    async (payload, { dispatch }) => {
        dispatch(validationStartAction());
        try {
            const response = await fetch(`${env.validationRoute}?code=${payload.password}`);
            const data = await response.json();
            setTimeout(() => {
                if (data.sn === payload.sn) {
                    dispatch(validatedSuccessAction());
                } else {
                    dispatch(validatedErrorAction());
                }
            }, globals.serviceValidationTimeout);
        } catch (error) {
            dispatch(validatedErrorAction());
        }
    }
);

export const locking = createAsyncThunk(
    'depositBox/locking',
    async (password, { dispatch }) => {
        dispatch(lockDepositBoxAction(password));
        setTimeout(() => {
            dispatch(lockDepositBoxSuccessAction());
        }, globals.mechanicalValidationTimeout);
    }
);

export const unlocking = createAsyncThunk(
    'depositBox/unlocking',
    async (payload, { dispatch }) => {
        dispatch(unlockDepositBoxAction());
        setTimeout(() => {
            if (payload.savedPassword === payload.password) {
                dispatch(unlockDepositBoxSuccessAction());
            } else {
                dispatch(goErrorStateAction());
            }
        }, globals.mechanicalValidationTimeout);
    }
);

const depositBoxSlice = createSlice({
    name: 'depositBox',
    initialState,
    reducers: {
        addKeyAction: (state, { payload }) => {
            state.password = !state.serviceMode && state.password.length === 6 ? state.password : state.password + payload;
            state.idle = false;
        },
        goToServiceModeAction: (state) => {
            state.serviceMode = true;
            state.status = 'Service';
            state.password = '';
        },
        goIdleAction: (state) => {
            state.idle = true;
        },
        validationStartAction: (state) => {
            state.status = 'Validating...';
            state.loading = true;
            state.password = '';
        },
        validatedSuccessAction: (state) => {
            state.status = 'Ready';
            state.loading = false;
            state.lock = false;
            state.serviceMode = false;
            state.password = '';
            state.savedPassword = '';
        },
        validatedErrorAction: (state) => {
            state.status = 'Error';
            state.loading = false;
            state.password = '';
        },
        goErrorStateAction: (state) => {
            state.status = 'Error';
            state.password = '';
            state.loading = false;
        },
        lockDepositBoxAction: (state, { payload }) => {
            state.lock = false;
            state.status = 'Locking...';
            state.savedPassword = payload;
            state.password = '';
            state.loading = true;
        },
        lockDepositBoxSuccessAction: (state) => {
            state.lock = true;
            state.status = '';
            state.loading = false;
        },
        unlockDepositBoxAction: (state) => {
            state.lock = true;
            state.status = 'Unlocking...';
            state.password = '';
            state.loading = true;
        },
        unlockDepositBoxSuccessAction: (state) => {
            state.lock = false;
            state.status = 'Ready';
            state.password = '';
            state.loading = false;
        },
    },
});

export const {
    addKeyAction,
    goToServiceModeAction,
    goIdleAction,
    validationStartAction,
    validatedSuccessAction,
    validatedErrorAction,
    goErrorStateAction,
    lockDepositBoxAction,
    lockDepositBoxSuccessAction,
    unlockDepositBoxAction,
    unlockDepositBoxSuccessAction,
} = depositBoxSlice.actions;

export default depositBoxSlice.reducer;
