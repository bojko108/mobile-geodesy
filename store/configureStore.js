import { createStore, applyMiddleware } from 'redux';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import thunk from 'redux-thunk';
import reducer from './reducer';

export default function configureStore(initialState) {
  return createStore(reducer, initialState, applyMiddleware(thunk, reduxImmutableStateInvariant()));
}
