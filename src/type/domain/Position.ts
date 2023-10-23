import { MayBeHas } from "../MayBeHas";

type Position
  = {
    x: number
    y: number
  }

const from = <T>(has: MayBeHas<T, Position> | number): Position => {
  return typeof has === "object"
    ? {
      x: has.x,
      y: has.y,
    }
    : {
      x: has,
      y: has,
    };
};
const Position = {
  from,
  init: (): Position => from({
    x: 0,
    y: 0,
  }),
};

export { Position };
