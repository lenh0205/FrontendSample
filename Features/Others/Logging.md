

========================================================
# Other types of "console."

## console.group - console.groupCollapsed
* -> create a **`group of related log messages`** together in the console
* -> _**`groupCollapsed`** thì khi log ra group sẽ được đóng chỉ hiện mỗi tiêu đề, cần user click vào để mở ra_

```js
// Start a new console group named "Group 1"
console.group("Group 1");

// Log messages inside "Group 1"
console.log("Message 1");
console.log("Message 2");

// End "Group 1"
console.groupEnd();
```

```js - trong trường hợp ta cần custom presentation của log message
const startLoadingTime = Date.now();

await myAsyncProcess();

const endLoadingTime = Date.now();
const loadingTime = (endLoadingTime - startLoadingTime) / 1000;

console.log(`%cEnd Loading at %c${loadingTime} seconds`, "color: blue;", "color: purple;")
```

## console.time & console.timeEnd
* -> **`measure the time taken`** by a block of code to execute
```js
console.time("timer");

for (let i = 0; i < 1000000; i++) {
    // Some time-consuming operation
}

console.timeEnd("timer");
```

## console.trace
* -> outputs **`a stack trace`** - visualize the **`call stack leading to the current execution point`**
* _nói chung là nó show callstack information (`function names, location in the code`) tại thời điểm `console.trace()` được gọi_
```js
function foo() {
  // Call the bar function
  bar(); // line number 3
}

function bar() {
  // Log a trace of the call stack
  console.trace("Trace:"); // line number 8
}

// Call the foo function
foo(); // line number 12

/* Output:
Trace:
bar @ (index):8
foo @ (index):3
(anonymous) @ (index):12
*/
```

## console.count & console.countReset
* -> **console.count** allows to **`count the number of times a particular piece of code is executed`**
* -> _use **console.countReset** to **`reset the count`**_
* _tức là mỗi lần gọi `console.count()` với cùng 1 lable, nó sẽ đếm cho ta số lần ta đã gọi với lable đó_

```js
function greet() {
  // Log and count the number of times "greet" is called
  console.count("call_greet");

  // Return a greeting message
  return "Hello!";
}

// Call greet() two times
greet();
greet();

// Reset the counter for "greet"
console.countReset("greet");

// Call greet() again
greet();

/*
call_greet: 1
call_greet: 2
call_greet: 1
*/
```

## console.table 
* -> display **`tabular data`** in the console - takes an array or an object as input and presents it as a table
```js
const users = [
    
{ name: "Chris", age: 25 },
    
{ name: "Dennis", age: 15 },
    
{ name: "Victor", age: 17 }
    
];

console.table(users);

/* Output:
(index)  |  name  |  age
-------------------------
0    |  Chris  |   25
1    |  Dennis |   15
2    |  Victor |   17
*/
```

## console.assert
* -> assert whether a condition is true or false; if the **`condition is false, it will log an error message to the console`**
```js
const x = 5;
console.assert(x === 10, "x is not equal to 10"); // Assertion failed: x is not equal to 10
```

