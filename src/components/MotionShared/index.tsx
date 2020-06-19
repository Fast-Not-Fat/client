import React, { FC, useCallback, useEffect, useRef } from "react";
import Classnames from "classnames";
import { gsap } from "gsap";

// components
import Area from "../Area";
import InterfaceBleed, {
  BleedPosition,
  BleedColor
} from "../../components/InterfaceBleed";

// style
import "./index.scss";

export enum Type {
  preamble = "preamble",
  transition = "transition",
  ending = "ending"
}

export enum Extension {
  mp4 = "mp4",
  webm = "webm"
}

export enum Position {
  center = "center",
  left = "left"
}

interface Props {
  type: Type;
  extension: Extension;
  position: Position;
  isPlayed: boolean;
  onEnded: any;
  onLoadedData: any;
  bleedColor: BleedColor;
}

const MotionShared: FC<Props> = ({
  type,
  extension,
  position,
  isPlayed,
  onEnded,
  onLoadedData,
  bleedColor
}) => {
  // refs
  const $motionVideo = useRef<HTMLVideoElement>(null);
  const $motionOverlay = useRef<HTMLDivElement>(null);

  // handlers

  const handleOnVideoEnded = useCallback(() => {
    gsap
      .to($motionOverlay.current, {
        duration: 0.2,
        opacity: 1
      })
      .then(() => {
        onEnded();
      });
  }, [onEnded]);

  // useEffect

  useEffect(() => {
    if (isPlayed) {
      gsap
        .to($motionOverlay.current, {
          duration: 0.2,
          opacity: 0
        })
        .then(() => {
          $motionVideo.current?.play();
        });
    } else {
      $motionVideo.current?.pause();
    }
  }, [isPlayed]);

  useEffect(() => {
    $motionVideo.current?.load();
    $motionVideo.current?.setAttribute("muted", "true");
  }, []);

  // return

  return (
    <div className="motion-shared">
      <div className="motion-shared__container">
        <Area height="min">
          {isPlayed && (
            <InterfaceBleed
              position={BleedPosition.left}
              bgColor={bleedColor}
              elementWidth={$motionVideo.current?.clientWidth}
            />
          )}
          <video
            ref={$motionVideo}
            className={Classnames("motion-shared__video", position)}
            playsInline
            muted
            autoPlay={false}
            preload="auto"
            onEnded={handleOnVideoEnded}
            onLoadedData={onLoadedData}
          >
            <source
              src={require(`../../assets/motions/${type}.${extension}`)}
            />
          </video>
          {isPlayed && (
            <InterfaceBleed
              position={BleedPosition.right}
              bgColor={bleedColor}
              elementWidth={$motionVideo.current?.clientWidth}
            />
          )}
        </Area>
        <div ref={$motionOverlay} className="motion-shared__overlay"></div>
      </div>
    </div>
  );
};

export default MotionShared;
