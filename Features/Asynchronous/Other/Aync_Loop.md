
# Loop & Async/Await
* -> **generator function** is polyfill of **`async/await`** 

* -> the **for/of loop** is designed to handle this 
* -> a **simple for() loop** works because the iterations are also in one single generator function

* -> **forEach() loop** - **`does not wait to move to the next iteration`** after each async code execution is completed (tức là task sẽ start in parallel, not in sequential)
* -> using forEach means that **`each iteration has an individual generator function`**; so they will be executed independently and has no context of next() with others

## Reading in sequence:
```js
// to read the files in sequence, we cannot use forEach indeed. 
// just use a modern "for/of" loop instead, in which await will work as expected:

async function printFiles () {
  const files = await getFilePaths();

  for (const file of files) {
    const contents = await fs.readFile(file, 'utf8');
    console.log(contents);
  }
}
```

## Reading in parallel:
```js
// to read the files in parallel, we cannot use forEach indeed
// each of the async callback function calls does return a promise, but we're throwing them away instead of awaiting them 
// by using map instead, and we can await the array of promises that we'll get with Promise.all

async function printFiles () {
  const files = await getFilePaths();

  await Promise.all(files.map(async (file) => {
    const contents = await fs.readFile(file, 'utf8')
    console.log(contents)
  }));
}
```
```js - hoặc là - guarantee the order in which the "Promises" are resolve
async function printFiles () {
  const files = await getFilePaths();

  await files.reduce(async (promise, file) => {
    await promise;
    const contents = await fs.readFile(file, 'utf8');
    console.log(contents);
  }, Promise.resolve());
}
```