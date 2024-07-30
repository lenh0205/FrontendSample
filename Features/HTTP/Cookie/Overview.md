===========================================================================
# Cookie
* -> cookie were invented to solve the problem **how server remember information about the user**
* -> cookies are **data** - **`stored in small text files on our computer`**; when a browser send requests to a server, **cookies belong to the page are added to the request**
* -> cookie **belongs to the current page  by default** (_but we can set `path` parameter to override this_)
* -> cookie is **deleted when the browser is closed by default** (_but we can set `expires` parameter to override this_)

===========================================================================
# Basic Operation

## Create a Cookie
* -> if we set a new cookie, the **`new cookie is added to document.cookie`**; the **older cookies are not overwritten** 

```js
document.cookie = "username=John Doe";

// can also add an expiry date (in UTC time); and tell Browser what path the cookie belongs to
document.cookie = "username=John Doe; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/";
```

## Read cookies
* -> **`document.cookie`** will **return all cookies in one string** 
* -> however, even if we **`write a whole cookie string to document.cookie`**; when we read it out again, we **can only see the name-value pair of it**

```js
let x = document.cookie; // Output: cookie1=value; cookie2=value; cookie3=value;
```

## Change a cookie
* _change a cookie the same way as we create it_

```js
document.cookie = "username=John Smith; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/";
```

## Delete a cookie
* -> just set the **expires parameter** to a **`past date`**
* -> we should define the **cookie path** to ensure that we **`delete the right cookie`** (_some browsers will not let us delete a cookie if you don't specify the path_)

```js
document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
```

===========================================================================
# Extend Operation

## Set a cookie
```js
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires="+ d.toUTCString();

  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
```

## find the value of one specified cookie
```js
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// hoặc:
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
```

===========================================================================
# Example

```js
// -> if the cookie is set it will display a greeting
// -> if the cookie is not set, it will display a prompt box, asking for the name of the user, and stores the username cookie for 365 days

function checkCookie() {
  let username = getCookie("username");
  if (username != "") {
    alert("Welcome again " + username);
  } 
  else {
    username = prompt("Please enter your name:", "");
    if (username != "" && username != null) {
      setCookie("username", username, 365);
    }
  }
}
```