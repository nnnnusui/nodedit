import { Position } from "./Position";

import { ObjectMapper } from "@/function/ObjectMapper";
import { MayBeHas } from "@/type/MayBeHas";

type Size = {
  width: number
  height: number
}
const from = <T>(has: MayBeHas<T, Size> | number): Size => {
  return typeof has === "object"
    ? {
      width: has.width,
      height: has.height,
    }
    : {
      width: has,
      height: has,
    };
};
const Size = {
  from,
  init: (): Size => from({
    width: 1,
    height: 1,
  }),
  toPosition: ObjectMapper<Size, Position>({
    width: "x",
    height: "y",
  }).mapped,
  fromPosition: ObjectMapper<Position, Size>({
    x: "width",
    y: "height",
  }).mapped,
};
export { Size };
