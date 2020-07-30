import AsyncStorage from '@react-native-community/async-storage';
import {apiMiddleware} from 'redux-api-middleware';
import {persistStore, persistReducer} from 'redux-persist';
import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import thunk from 'redux-thunk';
import * as reducers from './reducers';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['timeline'],
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({...reducers}),
);

const store = createStore(
  persistedReducer,
  compose(applyMiddleware(apiMiddleware, thunk)),
);
const persistor = persistStore(store);

export {store, persistor};
