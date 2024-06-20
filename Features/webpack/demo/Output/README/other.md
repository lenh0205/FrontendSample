
# Chain webpack module loader
* -> **webpack Module loaders can be chained** - _each loader_ in the chain **`applies transformations to the processed resource`**
* -> a chain is executed in **reverse order**
* -> the first loader **passes its result (`resource with applied transformations`) to the next one**, and so forth
* -> finally, **webpack expects JavaScript to be returned by the last loader** in the chain
