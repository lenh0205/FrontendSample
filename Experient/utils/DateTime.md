
# Get each element in DateTime
```js
var currentdate = new Date(); 
var datetime = "full date time:
    + currentdate.getDate() + "/"
    + (currentdate.getMonth() + 1)  + "/" 
    + currentdate.getFullYear() + " @ "  
    + currentdate.getHours() + ":"  
    + currentdate.getMinutes() + ":" 
    + currentdate.getSeconds();
```

# ".getDate()" return an interger representing the current day of the week from 0 to 6 (Sunday is "0")
```js
// Assumpte "date" is Wednesday
date.getDay(); // Output: 3
```

# Get standard part in DateTime
```js
new Date().toLocaleString(); // 09/08/2014, 2:35:56 AM
new Date().toLocaleDateString(); // 09/08/2014
new Date().toLocaleTimeString(); // 2:35:56 AM

// get the "time" in the format hh:mm without AM/PM for US English
new Date().toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric"}); // Output: 02:35
```

# Compare 2 datetime
```js
// comparing the dates
if( date1 > date2 ) {
   // do something
} else if ( date1 < dae2 ) {
   // write some code
} else {
   // date is same
}
```

# Compare only Date part ignoring time

* **set the time to 0**
* -> using **setHours()** method takes 4 parameters: **`hours`**, **`minutes`**, seconds, and milliseconds
```js - cách 1:
let date1 = new Date().setHours(0,0,0,0);
let date2 = new Date().setHours(0,0,0,0);
```
https://www.tutorialspoint.com/How-to-compare-only-date-part-without-comparing-time-in-JavaScript#:~:text=The%20toDateString()%20method%20can,the%20time%20part%20to%20zero.
* 
```js - cách 2:
// remove the time from date object
```