
type Converted<T, Target, Convert>
  = {
    [K in keyof T]: T[K] extends Target ? Convert : T[K];
  }

const getValue
  = <Value, T extends Record<string, unknown>>(objOrVal: T | Value, key: keyof T): Value =>
    typeof objOrVal === "object"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ? (objOrVal as any)[key]
      : objOrVal;
const getCalc
  = <Calced
    ,LVal = Calced
    ,RVal = Calced
    >(calc: (lhs: LVal, rhs: RVal) => Calced) =>
      <LObj extends object
      >(lhs: LObj, rhs: Converted<LObj, LVal, RVal> | RVal): Converted<LObj, LVal, Calced> =>
        Object.entries(lhs)
          .reduce((sum, [key, val]) => {
            const lKey = key as keyof LObj;
            const lVal = val as LVal;
            const rVal = getValue<RVal, Converted<LObj, LVal, RVal>>(rhs, lKey);
            const value = typeof lVal === "number"
              ? calc(lVal, rVal)
              : lVal;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            Object.defineProperty(sum, key, {
              value: value,
              enumerable: true,
              writable: false,
            });
            return sum;
          },{} as Converted<LObj, LVal, Calced>);

export const Calc = (() => {
  const time = getCalc<number>((lhs, rhs) => lhs * rhs);
  const ifOrElse = (condition: (lhs: number) => boolean) => getCalc<number>((lhs, rhs) => condition(lhs) ? lhs : rhs);
  return {
    get: getCalc,
    "+": getCalc<number>((lhs, rhs) => lhs + rhs),
    "-": getCalc<number>((lhs, rhs) => lhs - rhs),
    "*": time,
    "/": getCalc<number>((lhs, rhs) => lhs / rhs),
    "%": getCalc<number>((lhs, rhs) => lhs % rhs),
    "??": getCalc<number, number | null | undefined>((lhs, rhs) => lhs ?? rhs),
    if: ifOrElse,
    max: getCalc<number>((lhs, rhs) => Math.max(lhs, rhs)),
    min: getCalc<number>((lhs, rhs) => Math.min(lhs, rhs)),
    round: <LObj extends object>(lhs: LObj) => getCalc<number>((lhs, rhs) => Math.round(lhs) * rhs)(lhs, 1),
    floor: <LObj extends object>(lhs: LObj) => getCalc<number>((lhs, rhs) => Math.floor(lhs) * rhs)(lhs, 1),
    positiveDiff: getCalc<number>((lhs, rhs) => Math.max(lhs, rhs) - Math.min(lhs, rhs)),
    opposite: <LObj extends object>(lhs: LObj) => time(lhs, -1),
  };
})();
