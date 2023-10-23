import clsx from "clsx";
import {
  Component,
  JSX,
  createSignal,
} from "solid-js";
import { SetStoreFunction } from "solid-js/store";

import styles from "./index.module.styl";

import { Calc } from "@/function/calcObj";
import { Camera } from "@/function/signal/createCamera";
import { Position } from "@/type/domain/Position";
import { Size } from "@/type/domain/Size";

const name = "NodeScaler";
const injectTag = "div";
type Props = {
  cellSize: Size
  camera: Camera
  nodeSize: Size
  setNodeSize: SetStoreFunction<Size>
}
const Self: ComponentFunc = (_props) => {
  const props = () => _props.props;
  const injects = () => _props.injects;

  const cellSize = () => props().cellSize;
  const camera = () => props().camera;
  const nodeSize = () => props().nodeSize;
  const setNodeSize = () => props().setNodeSize;

  const [getOnDownClickedCell, setOnDownClickedCell] = createSignal<Position>();
  const [getOnDownNodeSize, setOnDownNodeSize] = createSignal<Size>();
  const onPointerDown: JSX.EventHandlerUnion<This["Element"], PointerEvent>
    = (event) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      const clickedPosAtCamera = Position.from(event);
      const clickedPosScaled = Calc["+"](camera().position, clickedPosAtCamera);
      const clickedPos = Calc["/"](clickedPosScaled, Size.toPosition(camera().scale));
      const clickedCell = Calc["/"](clickedPos, Size.toPosition(cellSize()));
      setOnDownClickedCell(clickedCell);
      setOnDownNodeSize({ ...nodeSize() });
    };
  const onPointerMove: JSX.EventHandlerUnion<This["Element"], PointerEvent>
    = (event) => {
      const clickedCell = getOnDownClickedCell();
      if (!clickedCell) return;
      const onDownNodeSize = getOnDownNodeSize();
      if (!onDownNodeSize) return;
      const movedPosAtCamera = Position.from(event);
      const movedPosScaled = Calc["+"](camera().position, movedPosAtCamera);
      const movedPos = Calc["/"](movedPosScaled, Size.toPosition(camera().scale));
      const movedCell = Calc["/"](movedPos, Size.toPosition(cellSize()));
      const differenceCell = Calc["-"](movedCell, clickedCell);
      const differenceCellRounded = Calc.round(differenceCell);
      setNodeSize()(Calc["+"](onDownNodeSize, Size.fromPosition(differenceCellRounded)));
    };
  const onPointerUp: JSX.EventHandlerUnion<This["Element"], PointerEvent>
    = () => {
      setOnDownClickedCell(undefined);
    };

  return (
    <div
      {...injects()}
      class={clsx(name, styles[name], injects()?.class)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <svg viewBox="0 0 48 48">
        <g>
          <line x1="38" y1="12" x2="38" y2="36"/>
          <line x1="10" y1="36" x2="38" y2="36"/>
        </g>
      </svg>
    </div>
  );
};

const self = {
  componentName: name,
  tag: injectTag,
} as const;
const This = Object.assign(Self, self);
type Injects = JSX.IntrinsicElements[typeof self.tag]
type SelfElement = HTMLElementTagNameMap[typeof self.tag]
type ComponentFunc = Component<{
  props: Props
  injects?: Injects
}>
type This = {
  Props: Props
  Injects: Injects
  Element: SelfElement
  Component: ComponentFunc
}
export default This;
