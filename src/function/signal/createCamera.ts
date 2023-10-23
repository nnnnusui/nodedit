import { Setter, createSignal } from "solid-js";

import { Calc } from "../calcObj";

import { Position } from "@/type/domain/Position";
import { Size } from "@/type/domain/Size";

export type Camera = {
  scale: Scale
  translate: Translate
  position: Position
  atBoardFromAtCamera: (atCamera: Position) => Position
}
export const createCamera = (): CameraSignal => {
  const [scale, setScaleRaw] = createSignal<Size>(Size.init());
  const [translate, setTranslate] = createSignal(Position.init());
  const position = () => Calc.opposite(translate());

  const setScale: SetScale = (setter, options) => {
    setScaleRaw((_prevScale) => {
      const prevScale = options?.prevScale ?? _prevScale;
      const nextScaleRaw = typeof setter === "function" ? setter(prevScale) : setter;
      const nextScale = Calc.if((it) => isFinite(it) && 0 < it)(nextScaleRaw, prevScale);
      if (options){
        const origin = options.origin;
        const nextOrigin = options.nextOrigin;
        setTranslate((_prevTranslate) => {
          const prevTranslate = options.prevTranslate ?? _prevTranslate;
          return getScaledTranslate({
            prevOriginOnScreen: origin,
            nextOriginOnScreen: nextOrigin ?? origin,
            prevTranslate: prevTranslate,
            prevScale: prevScale,
            nextScale: nextScale,
          });
        });
      }
      return nextScale;
    });
  };

  const [scaleInAction, setScaleInAction] = createSignal<ScaleInAction>();
  const scaleAction: Actions["scale"]
    = (points: Position[], keepRatio?: boolean) => {
      const onDown = scaleInAction();
      if (!onDown || onDown.pointsCount !== points.length) {
        const sumMax = points.reduce((max, it) => Calc.max(max, it), Position.init());
        const distance = Calc.positiveDiff(
          sumMax,
          points.reduce((min, it) => Calc.min(min, it), sumMax)
        );
        const origin = Calc["/"](
          points.reduce((sum, it) => Calc["+"](sum, it), Position.init()),
          Math.max(1, points.length)
        );
        setScaleInAction(() => ({
          pointsCount: points.length,
          scale: scale(),
          translate: translate(),
          origin: origin,
          distance: Size.fromPosition(distance),
        }));
      } else {
        if (points.length === 0) return;
        const sumMax = points.reduce((max, it) => Calc.max(max, it), Position.init());
        const sumMin = points.reduce((min, it) => Calc.min(min, it), sumMax);
        const distance = Calc.positiveDiff(sumMax, sumMin);
        const origin = Calc["/"](
          points.reduce((sum, it) => Calc["+"](sum, it), Position.init()),
          points.length
        );
        const current = {
          distance: Size.fromPosition(distance),
          origin,
        };
        const scaleScalarRaw = Calc["/"](current.distance, onDown.distance);
        const scaleScalar
          = keepRatio ?? false
            ? Math.max(scaleScalarRaw.width, scaleScalarRaw.height)
            : scaleScalarRaw;
        const nextScale = Calc["*"](onDown.scale, scaleScalar);
        setScale(nextScale, {
          origin: onDown.origin,
          nextOrigin: current.origin,
          prevScale: onDown.scale,
          prevTranslate: onDown.translate,
        });
      }
    };

  return [{
    get scale() { return scale(); },
    get translate() { return translate(); },
    get position() { return position(); },
    atBoardFromAtCamera: (atCamera: Position) =>  {
      const atBoardScaled = Calc["+"](position(), atCamera);
      const atBoard = Calc["/"](atBoardScaled, Size.toPosition(scale()));
      return atBoard;
    },
  }, {
    scale: setScale,
    translate: setTranslate,
  }, {
    scale: scaleAction,
  }];
};

const getScaledTranslate = (args: {
  prevOriginOnScreen: Position,
  nextOriginOnScreen: Position,
  prevScale: Size,
  nextScale: Size,
  prevTranslate: Position,
}) => {
  const screenOnBoard = Calc.opposite(args.prevTranslate);
  const cursorOnBoard = Calc["+"](screenOnBoard, args.prevOriginOnScreen);
  const cursorOnBoardNoneScaled = Calc["/"](cursorOnBoard, Size.toPosition(args.prevScale));
  const cursorOnBoardNextScaled = Calc["*"](cursorOnBoardNoneScaled, Size.toPosition(args.nextScale));
  const screenOnBoardNextScaled = Calc["-"](cursorOnBoardNextScaled, args.nextOriginOnScreen);
  const nextTranslate = Calc.opposite(screenOnBoardNextScaled);
  return nextTranslate;
};

type Scale = Size
type Translate = Position
type SetScale = (setter: Parameters<Setter<Scale>>[0], options?: {
  origin: Position
  nextOrigin?: Position
  prevScale?: Scale
  prevTranslate?: Translate
}) => void
type Getters = Camera
type Setters = {
  scale: SetScale
  translate: Setter<Translate>
}
type Actions = {
  scale: (points: Position[], keepRatio?: boolean) => void
}
type CameraSignal = [
  Getters,
  Setters,
  Actions
]

type ScaleInAction = {
  pointsCount: number
  distance: Size
  origin: Position
  translate: Translate
  scale: Scale
}
