import React, { FC, useCallback, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

// store
import { useDispatch } from "react-redux";
import { selectors, actions } from "../../../redux";
import { useTypedSelector } from "../../../redux/store";

import "./index.scss";

const Room: FC = () => {
  const { t } = useTranslation();
  const { roomId } = useParams();
  const history = useHistory();

  // store

  const dispatch = useDispatch();
  const devicesArray = useTypedSelector(selectors.area.selectDevicesArray);
  const isGameStarted = useTypedSelector(selectors.game.selectIsStarted);

  // effect

  useEffect(() => {
    if (isGameStarted) {
      history.push("/game/");
    }
  }, [history, isGameStarted]);

  // handlers

  const handleOnClickStart = useCallback(
    event => {
      event.preventDefault();
      dispatch(actions.webSocket.emit.game.start());
    },
    [dispatch]
  );

  // return

  return (
    <div className="room">
      <div className="room__container">
        <h1 className="room__title">
          {t("room.title")} {roomId}
        </h1>
        <p>
          {t("room.player")}
          {devicesArray.length > 1 && "s"} :
        </p>
        <ul>
          {devicesArray.map(device => (
            <li key={device.id}>{device.id}</li>
          ))}
        </ul>
        <button
          onClick={handleOnClickStart}
          className="room__action button button--orange"
        >
          {t("room.buttons.start")}
        </button>
      </div>
    </div>
  );
};

export default Room;
