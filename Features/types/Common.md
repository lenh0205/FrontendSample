
# Conditional Return Type - Generic Function - base on Parameter Type
```js - general
function foo<T>(x: T): T { return x; }
const foo = <T extends unknown>(x: T) => x;
```

* **Note**: Type **`Foo<T>`** can not assignable to type **`T extends string ? string | Foo<T> : Foo<T>`**
* -> this quite tricky because **`T`** is union type; but compiler doesn't see this because **`T is opaque`** to compiler
* -> so the **`evaluation of conditional types`** that depend on **`generic type parameters`** is **deferred by the compile until T is specified**

```js
type useQueryParamReturnType<T extends [] | string[]> = T extends [] ? URLSearchParamsEntries : string[];
type useQueryParamType = <T extends [] | string[]>(...args: T) => useQueryParamReturnType<T>;

export const useQueryParam: useQueryParamType = (...args) => {
    const lstQueryParams: useQueryParamReturnType<[]> = useContext(QueryParamContext);
    if (!lstQueryParams) Notify("Required: Please provide 'QueryParamProvider' before using 'useQueryParam()' hook!!!");

    /** @param {useQueryParam(a, b, ...)} @type {string} */
    if (args?.length > 0) {
        const lstParamsValue: any = (args as string[])
            .map((paramKey: string) => lstQueryParams[paramKey] ?? "");
        return lstParamsValue;
    }

    /** @param {useQueryParam(x)} @type {undefined} */
    return lstQueryParams;
}

```