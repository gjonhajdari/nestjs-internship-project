import Events from "node:events";

import { StrictEventEmitter } from "nest-emitter";

interface AppEvents {
  forgotPasswordMail: (userToken: any) => void;
}

export type EventEmitter = StrictEventEmitter<Events.EventEmitter, AppEvents>;
