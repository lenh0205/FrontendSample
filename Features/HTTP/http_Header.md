# Best Practice 
* _tránh, bỏ những thông tin thừa trong Header -> tránh tăng **`size of both requests and responses`**, **`expose sensitive information`** (_passwords, API keys,... in plain text header)_

* should also implement logic to validate and sanitize request headers in order to **`prevent header injection attacks`**, such as **CRLF injection** or **HTTP response splitting**

==============================================================================
# CORS
* -> a **`default security feature implemented by browsers`** that helps to protect any sensitive data on your application
* -> browsers **`by default`** (_no instruction on header_) **` block any requests`** from _an application or a server that’s hosted on a **`different domain`**_ to your server application

## CORS Header - Cross-Origin Resource Sharing
*  a mechanism that allows **`a resource to be requested from a "different origin" than the one from which it "originated"`**
* -> plays a critical role in **API integration**
* -> must be carefully configured to **`prevent unauthorized access`**

* -> developers should use the **Access-Control-Allow-Origin** header to specify the permitted request origins
* -> also employ other CORS headers like **`Access-Control-Allow-Methods`** and **`Access-Control-Allow-Headers`** to restrict the types of requests and headers allowed

## Step
* -> When **`a loaded web page`** in a browser attempts to **`make a cross-origin request`**
* -> the browser first sends **a preflight request** to the server (_known as an **`OPTIONS`** request - essentially asks the server if it `accepts cross-origin requests from the browser's domain`_)
* -> after receives the preflight OPTIONS request; **`if the server is configured`** to allow cross-origin requests **`from the browser's domain`**
* -> it return **`a response with specific CORS headers`** (such as **Access-Control-Allow-Origin** - indicating **`which domains are permitted to access its resources`**)
* -> browser receives the server's **`response with the CORS headers`**, it **`carefully examines these headers`** to determine if the **`server has granted permission`** for the cross-origin request
* -> If the _server's response doesn't indicate permission_, the **`browser blocks the cross-origin request`** to protect security.
* -> If the server's response includes the browser's origin in the **`Access-Control-Allow-Origin header`**, the browser considers the **`cross-origin request to be authorized`** and proceeds with **`sending the actual request`** to the server. 
* -> when the browser proceeds with the actual request, the server receives and **`processes it like any other normal request`**, then sends the response back to the browser


===============================================================================
# Request Header

## Accept
* -> specifies the **`media types, content types`** that the **`client can handle or prefers in the response`**
* -> servers can **`choose an appropriate response format when multiple options are available`**

```r
// Accept: application/json
// => server may respond with "JSON data" rather than XML or HTML
```

## User-Agent
* -> identifies the **`client application or user agent`** (_Ex: web browser, crawler, or API client_) that is making the request
* -> provides details about the _software and version, operating system, and device_ **`used by the client`**

* Web Server can use it to determine the capabilities of the client, enabling server-side optimizations and customization based on the client's characteristics

```r
// if the User-Agent header indicates that the request is coming from the Chrome browser
// => the server may include CSS prefixes for CSS properties that are compatible with Chrome.
```

```r - "Denial-of-service (DDoS) attacks
// getting unwanted traffic in your servers
// the "User-Agent" might be a good hint often indicating the presence of bots
// -> Bots often ("but not all") have generic or unusual User-Agent strings compared to typical browsers used by humans
// -> need to combine with other techniques like "IP address analysis", "behavior monitoring", and "honeypots" to effectively identify and block unwanted traffic
```

## Authorization
* -> is used to carries **`credentials or tokens`** required for **`authentication purposes`**
* -> provide **`proof of identity and permissions`** to **`access protected resources`**

```r
// the client might include a JSON Web Token (JWT) as the value of the header
// => which the server will then verify before returning the requested resource
```

## Content-Type
* -> identifies the **`MIME type`**, **`media type`** of the content in the **`request body`**
```r
// Content-Type: application/json 
// => indicates that the request body contains "JSON data". 
// => this information helps the server successfully interpret and process the payload
```

## Cookie
* -> the client can use the Cookie header to **`send previously stored cookies back to the server`**
* -> th server then uses these cookies to **`associate the request with a specific user or session`**
* -> this header plays an important role in **`delivering personalized experiences`**, as it **`enables the server`** to **`remember a user’s login state`** or **`language preference`**

======================================================
# Response Header

## Cache-Control
* -> **`controls caching behavior`** for both **`client and intermediary servers`**
* -> defines **`how the response can be cached`** (_such as caching duration, cache validation, or disabling caching altogether_)

```r
// Cache-Control: max-age=3600, public 
// => instructs the client to cache the response for "a maximum of 3600 seconds" (1 hour) and allows "caching by public caches"
```

* _"Cache-Control" can `improve performance, user experience, reduces the load on servers`_
* -> improve page load times, reducing bandwidth usage, and reducing the number of repetitive requests for the same unchanged content
```r
// if a user visits the same web application several times in a short interval, 
// -> the client can retrieve the content from the browser’s cache, which eliminates the need for a round trip to the server. 
```

## Server
* -> includes the _name and version_ of the **`server software that generated the response`**, as well as information about the **`server’s technology stack`**
```r
// Server: Apache/2.4.10 (Unix) 
// => indicates that the response was generated by the Apache web server version 2.4.10. It’s important to note that the Server header is informational and doesn’t affect the API’s functionality.
```

## Set-Cookie
* -> **`instructs the client`** to **`store a cookie`** with the **`specified name, value, and additional attributes`** (_such as expiration, domain, path, and security flags_)
* -> the client will then **`include the cookie in subsequent requests`** in order to **facilitate stateful communication** and **personalized experiences**

## Content-Length
* -> specifies **`the size of the response body in bytes`**
* -> can **`help the client anticipate how much data it is going to receive`**
* -> **`improves performance`** by allowing the client to plan in advance for more _efficient memory allocation_ and _data processing_