=================================================================================
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

# Get current day of the week
* -> **.getDate()** return **`an interger representing the current day of the week from 0 to 6`** (Sunday is "0")
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

=================================================================================
# Compare 2 datetime
```js
const compare2Dates = () => {
   if( date1 > date2 ) {
      return 1;
   } else if ( date1 < date2 ) {
      return -1;
   } else if (date1 === date2) {
      return 0;
   }
}
```

# Compare only Date part ignoring time

* cách 1: **set the time to 0** - using **setHours()** method takes 4 parameters: **`hours`**, **`minutes`**, **`seconds`**, and **`milliseconds`**
```js 
let date1 = new Date().setHours(0,0,0,0);
let date2 = new Date().setHours(0,0,0,0);

compare2Dates(date1, date2) // Output: 0
```

* cách 2: **remove the "time" part from date object, keep "date" part only** - using **.toDateString** to **`convert a date object to date string (no time)`**; then we can convert back to date object
```js
let date1 = new Date().toDateString();
date1 = new Date(date1)

let date2 = new Date(2002, 06, 21).toDateString();
date2 = new Date(date2)

compare2Dates(date1, date2) // Output: 1
```

=================================================================================
# Caculate the number of days between two dates

```js
const date1 = new Date("01/16/2024");
const date2 = new Date("01/26/2024");

const differenceInTime = date2.getTime() - date1.getTime();
const differenceInDays = Math.round(differenceInTime / (1000 * 3600 * 24));
```

=================================================================================
# check if given string is valid datetime format
```js
const invalidFormat = Date.parse('01 Jan 197a 00:00:00 GMT'); // Output: NaN
const unixTimeZero = Date.parse('01 Jan 1970 00:00:00 GMT'); // Output: 0
const unixTime1 = Date.parse('04 Dec 1995 00:12:00 GMT'); // Output: 818035920000
```