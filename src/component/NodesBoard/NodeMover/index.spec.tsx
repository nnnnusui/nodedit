import "@testing-library/jest-dom";
import { render } from "@solidjs/testing-library";
import { describe, it, expect } from "vitest";

import styles from "./index.module.styl";

import This from "./index";

const name = This.componentName;
describe(`<${name} /> test`, () => {
  const { container } = render(() => <This props={ {}} /> );
  const component = container.firstChild as HTMLElement;
  it("has rendered", async () => {
    expect(component).toBeInTheDocument();
  });
  it("has global-css class", async () => {
    expect(component.classList.contains(name)).toBe(true);
  });
  it("has module-css class", async () => {
    expect(component.classList.contains(styles[name])).toBe(true);
  });
});
