import {
  Meta,
  Link,
  Title,
} from "@solidjs/meta";
import {
  Component,
} from "solid-js";

const Head: Component = () => {

  return (
    <>
      <Title>nodEdit</Title>
      <Meta name="viewport" content="width=device-width, initial-scale=1" />
      <Meta name="charset" content="utf-8" />
      <Link rel="icon" type="image/ico" href="/src/assets/favicon.ico" />
    </>
  );
};

export default Head;
