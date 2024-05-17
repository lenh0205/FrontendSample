# Typescript

## an Error in try/catch block only receive "unknown" or "any" type
* -> ta cần nhớ **typescript only exists at compile time**
* -> typescript sẽ không cho phép ta tạo ra 1 **`custom Error type`** để assign cho **`error in catch block`** 
* -> because there's no way that typescript can **verify error type at compile time** 
* -> the only thing the code can throw is **`a ValidationError`** 

* => everything must be **handled in a single catch block** (_no multiple_), and distinguishing which **type of error must be done with explicit code**

## Solution
* -> to **`check an error to have a certain type`**, we'll need to either add code to verify:

```ts
catch (err: unknown) {
  if (err instanceof ValidationError) {
     // Inside this block, err is known to be a ValidationError
  }
}

// or  use type assertions to tell typescript "i know it's this type, trust me"
catch (err: unknown) {
  const knownError = err as ValidationError;
  getValidationERrors(knownError);
}
```

## For Axios
```ts
try {
			return await axios.post(apiURL, requestBody, requestHeader);
}
catch (err) {
  if (axios.isAxiosError(err)) { // check if "Error" is "AxiosError"
    const errorMessage = err?.response?.data?.errorMessage || err?.message;
    throw new Error(errorMessage);
  }
  throw err;
}
```

## Programming Language different
* **`Java`** 
* -> require us to write the **`type of an exception`** because  it is able to check **`whether that exception can be thrown at compile-time`**
* -> but more importantly,  it will check **`what type of exception was thrown at runtime`**, and **`only executing the catch block`** if the exception type matches the catch clause
* -> java supports multiple catch blocks, with different types of errors being handled by different ones, but since typescript 

```java - For example:
// in Java you can define which errors your function will throw as part of the function definition, as in
public static FileInputStream example(String fileName) throws FileNotFoundException {}
```

===============================================================
# Handle Exception in Typescript
* _https://basarat.gitbook.io/typescript/type-system/exceptions_

===============================================================
# Handle Multiple "catch" clause
https://subscription.packtpub.com/book/web-development/9781783552139/11/ch11lvl1sec78/multiple-catch-clauses
https://www.geeksforgeeks.org/how-to-increase-multiple-try-catch-readability-in-javascript/
https://bobbyhadz.com/blog/use-and-format-multiple-try-catch-statements-in-javascript
https://www.w3resource.com/javascript-exercises/error-handling/javascript-error-handling-exercise-8.php
https://stackoverflow.com/questions/33781818/multiple-catch-in-javascript
https://medium.com/geekculture/how-to-strongly-type-try-catch-blocks-in-typescript-4681aff406b9
