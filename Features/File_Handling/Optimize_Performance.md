# Latency (Độ trễ):
* -> by now, we have an application that stores uploaded files `somewhere in the world`
* -> _VD: an Object Storage bucket from Akamai cloud computing services lives in the "us-southeast-1" region_
* => so **`anyone living far away from the region that photo is hosted`** has to **wait longer** before their eyes can feast on this beast

* => that’s why **CDN** exist

=====================================================
# CDN - Content Delivery Network
* -> **`a connected network of computers`** that are **globally distributed** and can **store copies of the same files** 
* -> so that _when a user makes a request for a specific file_, it can be **`served from the nearest computer`** to the user
* => the **`distance a request must travel is reduced`**, thereby resolving requests faster, **`regardless of a user’s location`**
* => reducing network latency

## Mechanism
* instead of **`serving the file directly`** from my **`Object Storage bucket`**, we **can set up a CDN in front of my application** to **cache the photo** all over the world
* -> when the request is made for this image, the CDN can **check if it already has a cached version**
* -> if it does, it can **`respond immediately`**; if it doesn’t, it can go **`fetch the original file from Object Storage`**, then **save a cached version for any future requests**

```r - VD: 
//a webpagetest.org test results for a photo 
// The request was made from their servers in Japan, and it took "1.1 seconds" for the request to complete
// after set up a CDN,
// users in Tokyo will get the same photo but served from their nearest CDN location (which is probably in Tokyo), and users in Toronto are going to get that same file, but served from their nearest CDN location (which is probably in Toronto)
// make the same request, results still show the same photo, and the request still originated from Tokyo, but this time it only took "0.2 seconds"; a fraction of the time!
```

## The compounding returns of CDNs
* **`make applications run faster`**
* -> _by putting CDN in front of my application_, all the other **`static files`** can automatically get cached as well
* -> this includes the **`files`** that Nuxt.js **`generates in the build process`**, and which are hosted on the application server
* -> this is especially relevant when you consider the **Critical rendering path** and **render-blocking resources** like CSS, JavaScript, or fonts

* when a **`webpage loads`**, as the browser **`comes across a render-blocking resource`**, 
* -> it will **`pause parsing`** and go download the resource before it continues (hence "render-blocking") 
* -> So any **`latency that affects a single asset`** may also **`impact the performance of other assets`** further down the _network cascade_

=====================================================
# Connect Akamai CDN to Object Storage
* -> Akamai is the largest **`CDN provider`** in the world (_about 300,000 servers across 4,000 locations_)

## Setup Property
* in the _Akamai Control Center_, I created a **`new Property`** using the _Ion Standard product_, which is great for general purpose CDN delivery

* **Setup Host name**:
* -> add a new **`hostname`** in the _Property Hostnames section_ (_the URL where users will find your application_) (_VD: `uploader.austingil.com`_)
* -> setting up an **`SSL certificate`** for the hostname
* => after done, , Akamai will show the **Property Hostname** and **Edge Hostname** (_VD: `uploader.austingil.com` and `uploader.austingil.com-v2.edgekey.net`_)

* **set up the actual property’s behavior** 
* -> means **`editing the Default Rule`** under the **`Property Configuration Settings`**
* -> specifically, point the **Origin Server Hostname** to the domain where our **`origin server`** will live (_`origin-uploader.austingil.com`_)

* **Set up DNS**:
* -> created a new **A record** pointing the **`Origin Server Hostname`** (_origin-uploader.austingil.com_) to our **origin server’s IP address**
* -> added a **CNAME record** that points **`Property Hostname`** (_uploader.austingil.com_) to the **`Edge Hostname`** provided by Akamai
* => this lets us build out our **`CDN configuration`** and test it as needed, only sending traffic through the CDN when we’re ready

```r
A: origin-uploader.austingil.com -> origin server IP
CNAME: uploader.austingil.com -> uploader.austingil.com-v2.edgekey.net
```

* finally, to **serve files in our Object Storage instance** through Akamai
* -> **`created a new rule`** based on the **`blank rule template`** 
* -> set the **`rule criteria`** to **`apply to all requests`** going to the /files/* sub-route
* -> the `rule behavior` is set up to **rewrite the request’s "Origin Server Hostname"** and **change it to our Object Storage location** (_VD: npm.us-southeast-1.linodeobjects.com_)

```r - the result:
// any request that goes to "uploader.austingil.com/files/nugget.jpeg" is served through the CDN, 
// but the file originates from the Object Storage location
// and when we load the application, all the static assets generated by Nuxt are served from the CDN as well
// all other requests are passed through Akamai and forwarded to "origin-uploader.austingil.com", which points to the origin server
```

====================================================
# Note
* there’s still a whole world of tweaking **`CDN configuration to get even more performance`**
* there are also a lot of **`other performance and security features`** a CDN can offer beyond just _static file caching_:
* -> **Web Application Firewalls** 
* -> **faster network path resolution**
 * -> **DDoS protection**
* -> **bot mitigation**
* -> **edge compute**
* -> **automated image and video optimization**
* -> **malware scanning**
* -> **request security headers**
* -> .... 
