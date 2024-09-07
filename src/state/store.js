import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import database from './database';
import date from './date';

const persistConfig = {
    key: 'database',
    storage,
};

const rootReducer = combineReducers({
    // game: persistReducer({ key: 'game', storage }, game),
    database: persistReducer(persistConfig, database),
    date,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                ignoredActionPaths: ['payload'],
            },
        }),
});

export const persistor = persistStore(store);
