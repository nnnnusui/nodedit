type Mapper<From, To> = Record<keyof From, keyof To>
export const ObjectMapper
  = <From extends Record<string, unknown>
    ,To extends Record<string, unknown>
    >(keyMap: Mapper<From, To>) => ({
      mapped: (obj: From): To =>
        Object.entries(obj)
          .reduce((sum, [key, val]) => {
            const lKey = key as keyof From;
            const rKey = keyMap[lKey];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            Object.defineProperty(sum, rKey, {
              value: val,
              enumerable: true,
              writable: false,
            });
            return sum;
          },{} as To),
    });
