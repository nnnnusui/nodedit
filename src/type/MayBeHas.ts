export type MayBeHas<T, Has> =
  T extends Has ? T : never
