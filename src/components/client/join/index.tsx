import React, { FC, useCallback, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

// store
import { useDispatch, useSelector } from "react-redux";
import { selectors, actions } from "../../../redux";

// style
import "./index.scss";

const Join: FC = () => {
  // states

  const [inputRoomId, setInputRoomId] = useState("");

  // store
  const dispatch = useDispatch();
  const roomId = useSelector(selectors.room.selectId);
  const roomError = useSelector(selectors.room.selectCode);
  const screenSize = useSelector(selectors.device.selectScreenSize);

  const history = useHistory();

  // handlers

  const handleOnClickStart = useCallback(
    event => {
      event.preventDefault();
      dispatch(
        actions.webSocket.emit.room.join({
          height: screenSize.height,
          width: screenSize.width,
          id: inputRoomId
        })
      );
    },
    [dispatch, inputRoomId, screenSize]
  );

  const handleChange = useCallback(event => {
    setInputRoomId(event.target.value);
  }, []);

  useEffect(() => {
    if (roomId) {
      history.push("/waiting-room/" + roomId);
    }
  }, [history, roomId]);

  // return

  return (
    <div className="join">
      <div className="join__container">
        <form onSubmit={handleOnClickStart} className="join__form">
          <label className="form__label" htmlFor="roomId">
            Numéro de la partie
          </label>
          <input
            type="text"
            value={inputRoomId}
            onChange={handleChange}
            className="form__input"
            name="roomId"
            id="roomId"
          />
          <button
            type="submit"
            onClick={handleOnClickStart}
            className="form__action button button--orange"
          >
            Rejoindre
          </button>
        </form>
        <div className="join__error">{roomError}</div>
      </div>
    </div>
  );
};

export default Join;
