import logo from "../assets/logo/spritesheets/logo.png";
import teacher_fail from "../assets/illustrations/score/spritesheets/teacher_fail.png";
import teacher_success from "../assets/illustrations/score/spritesheets/teacher_success.png";

export enum animationId {
  logo = "logo",
  teacher_fail = "teacher_fail",
  teacher_success = "teacher_success"
}

interface AnimationType {
  image: any;
  widthFrame: number;
  heightFrame: number;
  steps: number;
  fps: number;
  loop: boolean;
}

const animations: { [key: string]: AnimationType } = {
  [animationId.logo]: {
    image: logo,
    widthFrame: 400,
    heightFrame: 289,
    steps: 214,
    fps: 25,
    loop: true
  },
  [animationId.teacher_fail]: {
    image: teacher_fail,
    widthFrame: 60,
    heightFrame: 60,
    steps: 74,
    fps: 25,
    loop: false
  },
  [animationId.teacher_success]: {
    image: teacher_success,
    widthFrame: 60,
    heightFrame: 60,
    steps: 14,
    fps: 25,
    loop: false
  }
};

export default animations;
