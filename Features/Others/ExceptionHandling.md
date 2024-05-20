# Typescript
Typescript doesn't let you do that because there's no way that typescript can verify at compile time that the only thing the code can throw is a ValidationError. For that matter, you don't know that either: what if you get a RangeError, because the maximum call stack has been exceeded? Obviously that's unlikely (you'd have to build up a big call stack before calling this), but nothing about this code can guarantee that it won't happen.

If you want the error to have a certain type, you will need to either add code to verify that it is actually that type:

```ts
catch (err: unknown) {
  if (err instanceof ValidationError) {
     // Inside this block, err is known to be a ValidationError
  }
}

// Or you will need to use type assertions to tell typescript "i know it's this type, trust me"
catch (err: unknown) {
  const knownError = err as ValidationError;
  getValidationERrors(knownError);
}
```

* Different languages have different constraints on their designs. 
* Java lets you (actually, requires you) to write the type of an exception because at compile-time it is able to check (for checked exception types) whether that exception can be thrown, but more importantly, at runtime it will check what type of exception was thrown, and only catch it (executing the catch block) if the exception type matches the catch clause.
* For example, in Java you can define which errors your function will throw as part of the function definition, as in
```java
public static FileInputStream example(String fileName) throws FileNotFoundException {}
```
* Neither javascript nor typescript have a way to specify this in a function definition.

* And java lets you have multiple catch blocks, with different types of errors being handled by different ones, but since typescript only exists at compile time, that's not an option. Everything must be handled in a single catch block, and distinguishing which type of error you're dealing with must be done with explicit code.


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
