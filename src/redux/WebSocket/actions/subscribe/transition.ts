import { createSubscribeAction } from "../actionCreators";
import { events } from "@colobobo/library";
import { actions as TransitionActions } from "../../../Transition";

export const init = createSubscribeAction(
  events.transition.init,
  TransitionActions.init.type
);

export const start = createSubscribeAction(
  events.transition.start,
  TransitionActions.start.type
);