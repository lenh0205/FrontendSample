
# get Cookie by name using Javascript
```js
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}
```

=================================================================
# "SameSite" attribute 
* -> declare whether your cookie is **restricted to a first-party or same-site context**
* -> provides 3 different ways to control this behaviour: **`not specify the attribute`**, or we can use **Strict** or **Lax** to limit the cookie to same-site requests
* -> it's **`recommended`**: setting **`cookies that affect website display`** to **Lax**, and **`cookies related to user actions`** to **Strict**
* _VD: cho phép 1 trang web tham chiếu đến static source như là ảnh của web ta, nhưng không cho phép thao tác trên resource của ta_

## Site
* -> the combination of the **`domain suffix`** and **`the part of the domain just before it`**

```r
// If the user is on "www.web.dev" and requests an image from "static.web.dev", thats a same-site request
// If the user is on "your-project.github.io" and requests an image from "my-project.github.io" thats a cross-site request
```

## Browser Default behavior
* -> **Cookies without a SameSite attribute** are treated as **`SameSite=Lax`**
* -> **Cookies with SameSite=None** **`must also specify 'Secure'`**, meaning they require a secure context

* _**Secure** - if true, this field indicates that the cookie can only be sent to the server over a secure, **`HTTPS connection`**_
* _Lưu ý: Chrome's default behavior is slightly more permissive than an explicit `SameSite=Lax`, because it lets sites send some cookies on top-level POST requests_
* _Lưu ý: Some earlier versions of browsers, including Chrome, Safari, and UC browser, are incompatible with the new `None` attribute_

```r
Set-Cookie: widget_session=abc123; SameSite=None; Secure
```

## SameSite=Strict
* -> _if we set SameSite to Strict_, our cookie can **only be sent in a first-party context** - the site for the cookie **`matches the site shown in the browser's address bar`**
* -> _tức là nếu user đang ở trang web nào khác và nhấp vào đường link để vào trang web của ta thì request đó sẽ không có cookie này_
* => suitable for **`cookies relating to features`** that are **always behind an initial navigation**, such as: _changing a password_ or _making a purchase_,....

```r
Set-Cookie: promo_shown=1; SameSite=Strict
```

## SameSite=Lax
* -> allows the browser to **send the cookie with these top-level navigations**

```js
// Another site:
<p>Look at this amazing cat!</p>
<img src="https://blog.example/blog/img/amazing-cat.png" />
<p>Read the <a href="https://blog.example/blog/cat.html">article</a>.</p>

Set-Cookie: promo_shown=1; SameSite=Lax

// -> browser requests amazing-cat.png for the other person's blog, our site doesn't send the cookie
// -> when the reader follows the link to cat.html on your site, that request does include the cookie
```

## SameSite=None
* -> want the cookie to be **sent in all contexts**
* -> that's if we **`provide a service that other sites consume`** such as **widgets, embedded content, affiliate programs, advertising, or sign-in across multiple sites**,...

