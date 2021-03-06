import React, { FC, useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router-dom";

// styles
import "./index.scss";

// store
import { useDispatch, useSelector } from "react-redux";
import { actions, selectors } from "../../../redux";
import { useTypedSelector } from "../../../redux/store";

// components
import { BleedColor } from "../../../components/InterfaceBleed";
import InterfaceScore from "../../../components/InterfaceScore";
import MotionShared, {
  Type,
  Extension,
  Position
} from "../../../components/MotionShared";
import MotionTransition from "../../../components/MotionTransition";

interface Props {
  isTansitionActive: boolean;
}

const Transition: FC<Props> = ({ isTansitionActive }) => {
  // selector
  const playerId = useSelector(selectors.room.selectPlayerId);
  const isCreator = useTypedSelector(selectors.room.selectIsCreator);
  const isRoundSuccess = useTypedSelector(
    selectors.transition.selectIsRoundSuccess
  );
  const isRoundFail = useTypedSelector(selectors.transition.selectIsRoundFail);
  const isTransitionStarted = useSelector(selectors.transition.selectIsStarted);
  const isTransitionNext = useTypedSelector(selectors.transition.selectIsNext);
  const roundWorld = useTypedSelector(selectors.transition.selectRoundWorld);
  const roundFailCause = useTypedSelector(
    selectors.transition.selectRoundFailCause
  );
  const isGameOver = useTypedSelector(selectors.game.selectIsOver);
  const hasGamePreamble = useTypedSelector(selectors.game.selectHasPreamble);

  // return

  const dispatch = useDispatch();
  const history = useHistory();

  const [showScore, setShowScore] = useState(false);
  const [showEnding, setShowEnding] = useState(false);
  const [showFailMotion, setShowFailMotion] = useState(false);

  const handleOnMotionTransitionEnded = useCallback((value: boolean) => {
    setShowFailMotion(false);
    setShowScore(value);
  }, []);

  const handleOnNextClick = useCallback(() => {
    dispatch(actions.webSocket.emit.transition.ended());
    if (isGameOver) {
      dispatch(actions.webSocket.emit.transition.next());
    }
  }, [dispatch, isGameOver]);

  const handleOnMotionSharedEnded = useCallback(() => {
    if (isCreator) {
      dispatch(actions.webSocket.emit.transition.ended());
    }
    if (isGameOver) {
      setTimeout(() => history.push("/leaderboard"), 2000);
    }
  }, [isCreator, isGameOver, dispatch, history]);

  const handleVideoIsReady = useCallback(() => {
    dispatch(actions.webSocket.emit.transition.playerReady({ playerId }));
  }, [dispatch, playerId]);

  // effect

  useEffect(() => {
    if (isTransitionNext && isGameOver) {
      setShowScore(false);
      setShowEnding(true);
    }
  }, [isGameOver, isTransitionNext]);

  useEffect(() => {
    if (isRoundSuccess && isTansitionActive) {
      setShowScore(true);
      dispatch(actions.webSocket.emit.transition.playerReady({ playerId }));
    }
  }, [dispatch, isRoundSuccess, isTansitionActive, playerId]);

  useEffect(() => {
    if (!isTansitionActive) {
      dispatch(actions.transition.stop());
      handleOnMotionTransitionEnded(false);
    }
  }, [dispatch, handleOnMotionTransitionEnded, isTansitionActive]);

  useEffect(() => {
    if (isTansitionActive && isRoundFail) {
      setShowFailMotion(true);
    }
  }, [isRoundFail, isTansitionActive]);

  // return

  return (
    <div className={`transition ${isTansitionActive ? "active" : ""}`}>
      {!hasGamePreamble && (
        <MotionShared
          type={Type.preamble}
          extension={Extension.mp4}
          position={Position.center}
          isPlayed={isTransitionStarted}
          onEnded={handleOnMotionSharedEnded}
          onLoad={handleVideoIsReady}
          bleedColor={BleedColor.preamble}
          showSkip={true}
          onSkipClick={handleOnMotionSharedEnded}
        />
      )}
      {showFailMotion && (
        <MotionTransition
          failCause={roundFailCause!}
          world={roundWorld}
          onMotionTransitionEnded={handleOnMotionTransitionEnded}
        />
      )}
      {showScore && (
        <InterfaceScore
          isScoreActive={showScore}
          isGameOver={isGameOver}
          onNextClick={handleOnNextClick}
        />
      )}
      {showEnding && (
        <MotionShared
          type={Type.ending}
          extension={Extension.mp4}
          position={Position.center}
          isPlayed={isTransitionStarted}
          onEnded={handleOnMotionSharedEnded}
          onLoad={handleVideoIsReady}
          bleedColor={BleedColor.preamble}
        />
      )}
    </div>
  );
};

export default Transition;
