import clsx from "clsx";
import {
  Component,
  JSX,
} from "solid-js";

import styles from "./index.module.styl";

const name = "{{properCase name}}";
const injectTag = "div";
type Props = unknown
const Self: ComponentFunc = (_props) => {
  const props = () => _props.props;
  const injects = () => _props.injects;

  return (
    <div
      {...injects()}
      class={clsx(name, styles[name], injects()?.class)}
    >
      no impl
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
