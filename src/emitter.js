import Emitter from 'tiny-emitter';

let emitter = new Emitter();

export const events = () => emitter;