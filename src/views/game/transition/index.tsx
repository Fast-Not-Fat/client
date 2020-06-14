import React, { FC, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";

// styles
import "./index.scss";

// store
import { useDispatch, useSelector } from "react-redux";
import { actions, selectors } from "../../../redux";

// components
import InterfaceScore from "../../../components/InterfaceScore";
import InterfaceButton, { Colors } from "../../../components/InterfaceButton";

interface Props {
  isActive: boolean;
}

const Transition: FC<Props> = ({ isActive }) => {
  // return

  const dispatch = useDispatch();
  const { t } = useTranslation();

  // selector
  const playerId = useSelector(selectors.room.selectPlayerId);
  // const isTransitionStarted = useSelector(selectors.transition.selectIsStarted);

  // effect

  useEffect(() => {
    if (isActive) {
      dispatch(actions.webSocket.emit.transition.playerReady({ playerId }));
    } else {
      dispatch(actions.transition.stop());
    }
  }, [dispatch, isActive, playerId]);

  // handlers

  const handleOnNextRoundClick = useCallback(() => {
    dispatch(actions.webSocket.emit.transition.ended());
  }, [dispatch]);

  // return

  return (
    <div className={`transition ${isActive ? "active" : ""}`}>
      <InterfaceScore isActive={isActive} />
      {/* <InterfaceButton
        onClick={handleOnNextRoundClick}
        color={Colors.blue}
        text={t("score.buttons.next")}
      /> */}
      {/*<div className="debug">
        <span>started : {isTransitionStarted ? "true" : "false"}</span>
        <button
          onClick={() => {
            dispatch(
              actions.webSocket.emit.transition.playerReady({
                playerId
              })
            );
          }}
        >
          Emit transition player ready
        </button>
      </div>*/}
    </div>
  );
};

export default Transition;
