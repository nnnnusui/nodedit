import clsx from "clsx";
import {
  Component,
  JSX,
} from "solid-js";

import styles from "./index.module.styl";

import { Calc } from "@/function/calcObj";
import { Position } from "@/type/domain/Position";

const name = "NodeAdder";
const injectTag = "div";
type Props = {
  addNode: (cell: Position) => void
  cellFromAtCamera: (atCamera: Position) => Position
}
const Self: ComponentFunc = (_props) => {
  const props = () => _props.props;
  const injects = () => _props.injects;

  const addNode = () => props().addNode;
  const cellFromAtCamera = () => props().cellFromAtCamera;

  const onPointerDown: JSX.EventHandlerUnion<This["Element"], PointerEvent>
    = (event) => {
      event.currentTarget.setPointerCapture(event.pointerId);
    };
  const onPointerUp: JSX.EventHandlerUnion<This["Element"], PointerEvent>
    = (event) => {
      const releasedAtCamera = Position.from(event);
      const releasedCell = cellFromAtCamera()(releasedAtCamera);
      const releasedCellRounded = Calc.floor(releasedCell);
      addNode()(releasedCellRounded);
    };

  return (
    <div
      {...injects()}
      class={clsx(name, styles[name], injects()?.class)}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      <svg viewBox="0 0 48 48">
        <g>
          <rect x="12" y="12" width="36" height="30"/>
        </g>
        <g>
          <line x1="36" y1="20" x2="46" y2="20"/>
          <line x1="41" y1="15" x2="41" y2="25"/>
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
