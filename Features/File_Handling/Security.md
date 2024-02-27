
# Introduction
* it's good practice to consult the experts at **OWASP.org** about **`security`**
* conveniently, they have a **File Upload Cheat Sheet** - outlines several **`attack vectors`** related to file uploads and **`steps to mitigate`** them

================================================
# Implement some of the recommendations from "OWASP’s cheat sheet"

## Extension Validation
* -> check the **`uploading file name extensions`**
* -> only allow files with the **`allowed extension types into our system`**

* -> we could check **`File name`** against a **`regular expression`** that tests whether a string **`ends with one of the allowed file extensions`**

```js - implement with "formidable" library using "filter" configuration option
// a function that has access to a "file" object parameter (provides some details about the file, including the original file name)
// this function return a "boolean" that tells formidable whether to "allow writing it to the storage location" or not

const form = formidable({
  // ... other config options
  filter(file) {
    const originalFilename = file.originalFilename ?? '';
    // Enforce file ends with allowed extension
    const allowedExtensions = /\.(jpe?g|png|gif|avif|webp|svg|txt)$/i;
    if (!allowedExtensions.test(originalFilename)) {
      return false;
    }
    return true;
  }
});
```

## Filename Sanitization
* -> protect against **`file names`** that may be **`too long`** or include **`characters that are not acceptable`** for the operating system
* -> we can **`generate a new filename`** for any upload (_may be a random string generator, a UUID, or some sort of hash_)

```js - implement with "formidable" library using "filename" configuration option
// a function return some random string
// but actually formidable’s default behavior is already to generate a random hash for every upload

const form = formidable({
  // ... other config options
  filename(file) {
    // return some random string
  },
});
```

## Upload and Download Limits
* -> protects our application from **`running out of storage`**
* -> limits how much we **`pay for storage`**
* -> limits how much **`data could be transferred`** if those files get **`downloaded`**, which may also affect how much we have to pay

* _right value to choose is highly subjective based on your application needs_
* _For example, an application that accepts high-definition video files will need a much higher limit than one that expects only PDFs_

```js - implement with "formidable" library using "maxFileSize" configuration option
// default value is 200 megabytes as the maximum file upload size

const form = formidable({
  // ... other config options
  maxFileSize: 1024 * 1024 * 10, // 10 megabytes
});

// Now when we upload a large JPEG file, 
// -> we'll get a failed request with a status code of 500 
// -> server console reports the error is because the maximum allowed file size was exceeded
```

## File Storage Location
* -> where uploaded files get stored
* -> the top recommendation is to store uploaded files in a **`completely different location`** (_VD: S3_) than where the **`application server is running`**
* -> that way, if **`malware does get into the system`**, it will still be quarantined without access to the running application
* => this can prevent **`access to sensitive user information, environment variables, ...`**

* **but if storing files on a different host isn’t an option**: 
* -> the best thing we can do is make sure that **`uploaded files`** do not end up in the **`root folder`** on the **`application server`**

```js - implement with "formidable" library using "uploadDir" configuration option
// formidable by default stores any uploaded files in the operating system’s temp folder
// => good for security, but if we want to access those files later on, the temp folder is probably not the best place to store them
// "uploadDir" to explicitly set the upload location (can be a relative path or an absolute path)

const form = formidable({
  // ... other config options
  uploadDir: './uploads', 
  // -> store files in a folder called "/uploads" inside my project folder
  // -> this folder must already exist, 
  // -> and if using a relative path, it must be relative to the application runtime (usually the project root)
});
```

## Content-Type Validation
* -> ensure that the uploaded files match a given **`list of allowed MIME-types`**
* -> similar to extension validation, but it’s important to also check a file’s MIME-type 
* -> because it’s easy for an attacker to **`simply rename a file`** to include a file extension that’s in our allowed list

* **Problem**
*  "formidable" actually generates the **`file’s MIME-type information`** based on the **`file extension`**
* => so it no more useful than our **`Extension validation`**
* => but it also makes sense and is likely to remain the case

* **Reason**:
* -> formidable’s filter function is designed to **`prevent files from being written to disk`**
* -> it **`runs as it’s parsing uploads`**
* -> the **`only reliable way`** to know a file’s MIME-type is by **checking the file’s contents**
* -> But we can only do that **after the file has already been written to the disk**
* => and **`checking file contents actually`** brings us to the issue **File content validation**

```js
const form = formidable({
  // ... other config options
  filter(file) {
    const originalFilename = file.originalFilename ?? '';
    const allowedExtensions = /\.(jpe?g|png|gif|avif|webp|svg|txt)$/i;
    if (!allowedExtensions.test(originalFilename)) {
      return false;
    }

    // check MIME type:
    const mimetype = file.mimetype ?? ''; 
    return Boolean(mimetype && (mimetype.includes('image')));
  }
});
```

## File Content Validation
* -> **`scan the file for malware`**
* -> malware scanning can only happen after the **`file has already been written to disc`** (_file already on server_) 
* -> scanning file contents can **`take a long time`**; far longer than is appropriate in a request-response cycle

## Other OWASP recommendations 
* -> **`limit file upload capabilities`** to **authenticated users**
* => this makes it easier to track and prevent abuse

===================================================
# Malware Scanning Architecture
* -> running a malware scan **`on every single upload request`** is probably **`not an option`**
* -> **the goal** is to **`protect application`** from **`malicious uploads`** as well as to **`protect our users`** from **`malicious downloads`**

## Mechanism
* -> instead of scanning uploads during the request-response cycle, we could **`accept all uploaded files`**, 
* -> **`store them in a safe location`**, and **`add a record`** in a database containing the file’s metadata, storage location, 
* -> and **a flag** to **`track whether the file has been scanned`**
* -> **schedule a background process** that locates and **`scans all the records`** in the database for **`unscanned files`**
* -> if it finds any **`malware`** - we could remove it, quarantine it, and/or notify about it
* -> for all the **`clean files`**, it can update their respective database records to **`mark them as scanned`**

## For the front end
* -> we’ll likely want to **`show any previously uploaded files`**, but we have to be **`careful about providing access to potentially dangerous ones`**

* _there are a couple different options:_
1. After an upload, only show the file information to the **user that uploaded it**, 
* -> letting them know that it **`won’t be available to others`** until after it’s been scanned
* -> we may even email them when it’s complete

2. After an upload, show the file to **every user**, 
* -> but **`do not provide a way to download the file`** until after it has been scanned
* -> include some messaging to tell users the file is pending a scan, but they **`can still see the file’s metadata`**

========================================================
# Block Malware at the Edge
* -> If we’re an Akamai customer, you actually have access to a **`malware protection feature`** as part of the **`web application firewall products`**
* -> if we have an application already integrated with Akamai’s Ion CDN, so it was easy to also set it up with a **`security configuration`** that includes _IP/Geo Firewall, Denial of Service protection, WAF, and Malware Protection_
* -> configure the **`Malware Protection`** policy to just deny any request containing malware or a content type mismatch
* => the files are scanned on Akamai’s edge servers, which means it’s not only faster, but it also keeps blocked malware from ever even reaching our servers

* _VD: if we go to my application and try to upload a file that has known malware, we’ll see almost immediately the response is rejected with a `403 status code`_