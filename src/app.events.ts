import Events from 'events';

import { StrictEventEmitter } from 'nest-emitter';

interface AppEvents {
  forgotPasswordMail: (userToken: any) => void;
}

export type EventEmitter = StrictEventEmitter<Events.EventEmitter, AppEvents>;
