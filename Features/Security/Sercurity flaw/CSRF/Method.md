
==================================================================
# How does the attack work?
* -> there are numerous ways in which **`an end user can be tricked`** into **loading information from** or **submitting information to a web application**
* -> _so how to `generate a valid malicious request` for our victim to execute ?_

* _the attach will comprise:_
* -> **building an exploit URL or script**
* -> **`tricking user into executing the action`** with **Social Engineering**

```r
// Alice wishes to transfer $100 to Bob using the bank.com web application that is vulnerable to CSRF 
// Maria - an "attacker" - wants to trick Alice into sending the money to Maria instead
```

## GET scenario
* -> the social engineering aspect of the attack tricks user into loading this URL when user is logged into the application account 
* -> The exploit URL can be disguised as an ordinary link, encouraging the victim to click it

* _this is usually done with one of the following techniques:_
* -> sending an unsolicited email with HTML content
* -> planting an exploit URL or script on pages that are likely to be visited by the victim while they are also doing online banking

* _a `real life example of CSRF attack` on an application using GET was a **uTorrent exploit** from 2008 that was used on a mass scale to download malware_

```r 
// the money transfer operation might be reduced to a request like: "http://bank.com/transfer.do?acct=BOB&amount=100 HTTP/1.1"
// Maria now decides to exploit this web application vulnerability using Alice as the victim

// Maria first constructs the following exploit URL which will transfer $100,000 from Alice’s account to Maria’s account
// Maria takes the original command URL and replaces the beneficiary name with herself, raising the transfer amount significantly at the same time: "http://bank.com/transfer.do?acct=MARIA&amount=100000"

// disguise exploit URL as an ordinary link: '<a href="http://bank.com/transfer.do?acct=MARIA&amount=100000">View my Pictures!</a>'
// or as a 0x0 fake image: '<img src="http://bank.com/transfer.do?acct=MARIA&amount=100000" width="0" height="0" border="0">'

// => if this image tag were included in the email, Alice wouldn’t see anything. However, the browser will still submit the request to bank.com 
// => without any visual indication that the money transfer has taken place
```
## POST scenario
* -> The only **`difference between GET and POST attacks`** is **how the attack is being executed by the victim**
* -> such a request cannot be delivered **`using standard A or IMG tags`**, but can be **delivered using a FORM tags**
* -> this form will **`require the user to click on the submit button`**, but this can be also **executed automatically using JavaScript**: **`<body onload="document.forms[0].submit()">`**

```r
// let’s assume the bank now uses POST and the vulnerable request looks like this: "POST http://bank.com/transfer.do HTTP/1.1" - "acct=BOB&amount=100"

// the exploit 
<form action="http://bank.com/transfer.do" method="POST">

<input type="hidden" name="acct" value="MARIA"/>
<input type="hidden" name="amount" value="100000"/>
<input type="submit" value="View my pictures"/>

</form>
```

## Other HTTP methods
* -> modern web application APIs frequently use other HTTP methods, such as **PUT** or **DELETE**
* -> such requests **`can be executed with JavaScript`** embedded into an exploit page; but this usually **imposible**
* -> because of the **same-origin policy** restrictions that **`enabled by default`**
* -> unless the target web site **`explicitly opens up cross-origin requests`** from the attacker’s (or everyone’s) origin by **using CORS** (Ex: **Access-Control-Allow-Origin: * header**)

* _assume the vulnerable bank uses `PUT` that takes a JSON block as an argument:_
```r
PUT http://bank.com/transfer.do HTTP/1.1
{ "acct":"BOB", "amount":100 }
```

==================================================================
# Prevention measures that do NOT work
* these **`flawed ideas for defending against CSRF attacks`** are recommended to avoid: 

## Using a secret cookie
* -> **all cookies, even the secret ones**, will be **`submitted with every request`**
* -> **`all authentication tokens will be submitted`** **regardless of whether or not the end-user was tricked into submitting the request**

* -> furthermore, **session identifiers** are simply used by the application container to **`associate the request with a specific session object`**
* -> the session identifier **does not verify that the end-user** intended to submit the request.

## Only accepting POST requests
* -> _applications can be developed to `only accept POST requests` for `the execution of business logic`_
* -> the **misconception** is that **since the attacker cannot construct a malicious link, a CSRF attack cannot be executed**
* -> unfortunately, this logic is incorrect; there are **`numerous methods`** in which an attacker can **`trick a victim into submitting a forged POST request`**
* -> such as **a simple form hosted in an attacker’s Website** with **`hidden values`**
* -> this form **`can be triggered automatically by JavaScript`** or can be **`triggered by the victim who thinks the form will do something else`**

## Multi-Step Transactions
* -> **`Multi-Step transactions`** are **not an adequate prevention** of CSRF
* -> as long as **an attacker can predict or deduce each step** of the completed transaction, then **`CSRF is possible`**

## URL Rewriting
* -> this **`might be seen as a useful CSRF prevention technique`** as the **attacker cannot guess the victim’s session ID**
* -> however, this make **the user’s session ID is exposed in the URL**
* -> and it not recommend **`fixing one security flaw by introducing another`**

## HTTPS
* -> **`HTTPS by itself`** **does nothing to defend against CSRF**
* -> However, HTTPS should be considered **a prerequisite for any preventative measures to be trustworthy**

## Validating the Referrer Header
* -> this doesn’t work in practice because **the referrer header can be easily spoofed by an attacker**
* -> additionally, _some users or browsers_ **might not send the referrer header** due to **`privacy settings or policies`**, leading to false positives
* -> moreover, there are situations where **the referrer can be null**, such as when **`a user navigates to a site from a bookmark`** or **`any other resource without a traditional url`**
* -> in these scenarios, **`legitimate requests could be mistaken`** as **potential CSRF attacks**, which would result in **`more potential false positive flags`**


