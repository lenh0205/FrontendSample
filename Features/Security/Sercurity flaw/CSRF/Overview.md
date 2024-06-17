==================================================================
# CSRF - Cross Site Request Forgery
* -> _or **`XSRF`**, **`“Sea Surf”`**, **`Session Riding`**, **`Cross-Site Reference Forgery`**, and **`Hostile Linking`**_
* -> _l **`Microsoft`** refers to this type of attack as **a One-Click attack**_

## Definition
* -> is **`an attack`** that **`forces an end user`** to **`execute unwanted actions`** on a web application in which they’re **currently authenticated**
* -> _in simple words, CSRF is an attack that **tricks the victim into submitting a malicious request**_
* -> it **inherits the identity and privileges of the victim** to **`perform an undesired function`** on the **victim’s behalf** (_though note that this is not true of `login CSRF` - a special form of CSRF_)

* -> for most sites, _browser requests_ **automatically include any credentials associated with the site**, such as the **`user’s session cookie, IP address, Windows domain credentials, and so forth`**
* -> therefore, if the user is **currently authenticated** to the site, the site'll have no way to distinguish between the **`forged request sent by the victim`** and **`a legitimate request sent by the victim`**

## Target functionality 
* -> _CSRF attacks_ target functionality that **causes a state change on the server**, such as **`changing the victim’s email address`** or **`password`**, or **`purchasing something`**
* -> Forcing the victim to **`retrieve data doesn’t benefit an attacker`** because **the attacker doesn’t receive the response, the victim does**; as such, CSRF attacks target state-changing requests

==================================================================

## Login CSRF
* -> **`use CSRF to obtain the victim’s private data`** via _a special form of the attack_
* -> the attacker **forces a non-authenticated user to log in to an account the attacker controls**
* -> if **`the victim doesn't realize`** this, they **may add personal data** - such as credit card information - **to the account**
* -> the attacker can then **log back into the account to view this data**, **`along with the victim’s activity history on the web application`**

* -> with a little help of **`social engineering`** (_such as **sending a link via email or chat**_), an attacker may **trick the users** of a web application into executing actions of the attacker’s choosing

* -> if the victim **`is a normal user`**, a successful CSRF attack can **force the user to perform state changing requests** like **`transferring funds`**, **`changing their email address`**, and so forth
* -> if the victim is an **`administrative account`**, CSRF can **compromise the entire web application**

## "stored CSRF flaws" vulnerability
* -> it’s sometimes possible to **store the CSRF attack on the vulnerable site itself**
* -> this can be accomplished by **simply storing an `IMG` or `IFRAME` tag in a field that accepts HTML**, or by **a more complex cross-site scripting attack**
* -> if the attack **can store a CSRF attack in the site**, **`the severity of the attack is amplified`**
* -> in particular, the likelihood is increased because **`the victim is more likely to view the page containing the attack than some random page on the Internet`**
* -> the likelihood is also increased because the **`victim is sure to be authenticated to the site already`**

==================================================================
# Prevention measures that do NOT work
* _recommend to avoid:_

## 
