import React, { FC, useCallback, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

// config
import { animationId } from "../../config/animations";

// store
import { useDispatch, useSelector } from "react-redux";
import { selectors, actions } from "../../redux";

// components
import InterfaceButton, {
  Colors as InterfaceButtonColors
} from "../../components/InterfaceButton";
import SpriteAnimation from "../../components/SpriteAnimation";

// style
import "./index.scss";

const Landing: FC = () => {
  const { t, i18n } = useTranslation();
  const history = useHistory();

  // states

  const [currentLanguage, setCurrentLanguage] = useState<string>("fr");

  // store

  const dispatch = useDispatch();
  const roomId = useSelector(selectors.room.selectId);
  const roomError = useSelector(selectors.room.selectError);
  const isAdmin = useSelector(selectors.admin.selectStatus);
  const adminRoomId = useSelector(selectors.admin.selectRoomId);
  const adminDeviceIndex = useSelector(selectors.admin.selectDeviceIndex);

  // handlers

  const handleOnClickCreateRoom = useCallback(() => {
    if (isAdmin && adminRoomId) {
      dispatch(
        actions.webSocket.emit.room.join({
          width: window.innerWidth,
          height: window.innerHeight,
          id: adminRoomId,
          ...(adminDeviceIndex ? { adminIndex: adminDeviceIndex } : {})
        })
      );
    } else {
      dispatch(
        actions.webSocket.emit.room.create({
          width: window.innerWidth,
          height: window.innerHeight
        })
      );
    }
  }, [isAdmin, adminRoomId, dispatch, adminDeviceIndex]);

  const handleChangeLanguage = useCallback(
    event => {
      setCurrentLanguage(event.target.value);
      i18n.changeLanguage(event.target.value);
    },
    [i18n]
  );

  const handleOnJoinRedirect = useCallback(() => {
    history.push("/join");
  }, [history]);

  // EFFECTS

  // when connected -> go to room

  useEffect(() => {
    if (roomId) {
      history.push("/room/" + roomId);
    }
  }, [history, roomId]);

  // return

  return (
    <div className="landing">
      <div className="landing__container">
        <select
          className="landing__languages"
          value={currentLanguage}
          onChange={handleChangeLanguage}
        >
          <option value="fr">{t("languages.french")}</option>
          <option value="en">{t("languages.english")}</option>
        </select>

        <Link to="/about" className="landing__about">
          <InterfaceButton color={InterfaceButtonColors.yellow} text={"?"} />
        </Link>

        <div className="landing__center">
          <div className="landing__logo">
            <SpriteAnimation animationID={animationId.logo} />
          </div>
        </div>

        <div className="landing__actions">
          <InterfaceButton
            onClick={handleOnClickCreateRoom}
            color={InterfaceButtonColors.yellow}
            text={t("landing.buttons.create")}
            classNames="landing__action"
          />
          <InterfaceButton
            onClick={handleOnJoinRedirect}
            color={InterfaceButtonColors.blue}
            text={t("landing.buttons.join")}
            classNames="landing__action"
          />
        </div>
        <div className="landing__error">{roomError}</div>
      </div>
    </div>
  );
};

export default Landing;
