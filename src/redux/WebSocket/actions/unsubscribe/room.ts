import { createUnsubscribeAction } from "../actionCreators";

import { EventsRoom } from "fast-not-fat";

// create

export const createSuccess = createUnsubscribeAction(EventsRoom.createSuccess);

export const createError = createUnsubscribeAction(EventsRoom.createError);

// join

export const joinSuccess = createUnsubscribeAction(EventsRoom.joinSuccess);

export const joinError = createUnsubscribeAction(EventsRoom.joinError);