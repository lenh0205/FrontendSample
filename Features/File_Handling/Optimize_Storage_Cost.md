# Stream File Uploads to "S3 Object Storage"

## Issue
* _receiving multipart/form-data in Node.js, parsing the request, capturing the file, and writing that file to the disk on the application server_
* -> this **`doesn’t work`** for **`distributed systems`** that _rely on several different machines_
* -> _if a user uploads a file_, it can be hard (or impossible) to **`know which machine received the request`**
* -> therefore, **where the file is saved** (_especially true if using **`serverless`** or **`edge compute`**_)
* -> and **`storing uploads`** on the application server can cause the server to quickly **run out of disk space**

* **Solution**
* => we could upgrade our server, but that's expensive
* => so that’s where **Object Storage** comes in

## Object Storage
* -> basically, _Object Storage_ like **`a folder on a computer`**
* -> we can put any `files` (**objects**) in it
* -> but the `folders` (**buckets**) live within **`a cloud service provider`**
* -> **`access files via URL`**

* => Object Storage is a **`single, central place`** to store and access all of your uploads
* => it’s designed to be `highly available, easily scalable, and super cost-effective`

* _there are some reasons that we need to **`upgrade application server`**; we may need more **`RAM or CPU`**_
* _but if we’re talking purely about **`disk space`**, Object Storage is a much cheaper solution._

```r 
// if using "shared CPU servers"
// -> we could run an application for $5/month and get 25 GB of disk space
// -> if your server starts running out of space, we could upgrade your server to get an "additional 25 GB", but that’s going to cost "$7/month more"

//  "Object Storage"
// -> get 250 GB for $5/month. 
// -> so 10 times more storage space for less cost
```

========================================================
# S3 - Simple Storage Service
* -> **`a standard`**
* -> includes **`an Object Storage product`** and **`a standard communication protocol`** for interacting with Object Storage solution 
* -> ban đầu được phát triển bởi AWS, sau được sử dụng bởi nhiều công ty cung cấp dịch vụ Object Storage khác
* => more options to choose from for Object Storage providers and fewer options to dig through for tooling
* => we can use the same libraries (maintained by AWS) with other providers
* => means the code we write today should work across any S3-compatible service

* we will use **@aws-sdk/client-s3** and **@aws-sdk/lib-storage** library to help us **`upload "objects" into our "buckets"`**

=========================================================
# Set up S3 bucket
* tìm provider phù hợp

# Set up S3 Client
* -> set up an S3 Client to **`make the upload requests`** for us
* -> import the **S3Client** constructor from **`@aws-sdk/client-s3`** and the **Upload** command from **`@aws-sdk/lib-storage`**
* -> configure the client using the S3 bucket **`endpoint, access key, secret access key, and region`**

```js - instantiate the "S3 Client" to communicate to "bucket"
// get config from ".env" file
const { S3_URL, S3_ACCESS_KEY, S3_SECRET_KEY, S3_REGION } = process.env;

// init
const s3Client = new S3Client({
  endpoint: `https://${S3_URL}`,
  credentials: {
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECRET_KEY,
  },
  region: S3_REGION,
});
// "S3_URL" is something like this "bucket-name.bucket-region.linodeobjects.com"
```

# Pipe file streams to an S3 upload request
* -> instead of processing the request and writing files to disk, we want to pipe file streams to an S3 upload request
* -> so as **`each file chunk`** is received, it’s **`passed through our handler`** to the **`S3 upload`**
* => change formidable’s configuration options

## "fileWriteStreamHandler" option of "formidable"
* -> _when this option is defined_, the default behavior of **`writing to host machine file system`** every file parsed is **`lost`**
* -> this function return an instance of a **Writable stream** that will **`receive the uploaded file data`**
* => allow to create _custom behavior_ regarding where the **`uploaded file data will be streamed for`**
* => write the **`file uploaded`** in other types of **cloud storages** (**`AWS S3, Azure blob storage, Google cloud storage`**) or **private file storage**
* => _As formidable parses each chunk of data from the request, it will pipe that chunk into the Writable stream that’s returned from this function_  

```js
// change formidable’s configuration options
function fileWriteStreamHandler(file) {
  // TODO
}
const form = formidable({
  multiples: true,
  fileWriteStreamHandler: fileWriteStreamHandler,
});
```

## Preparation
* -> this function must return a **`Writable stream`** to write each upload chunk to.
* -> it also needs to **`pipe each chunk of data to an S3 Object Storage`**
* -> we can use the **`Upload`** command from **`@aws-sdk/lib-storage`** to **`create the request`**
* -> the **`request body`** can be a stream, but it **`must be a Readable stream`**, **`not a Writable stream`**
* -> a **`Passthrough stream`** can be used as both a Readable and Writable stream.
* -> each request formidable will parse may **`contain multiple files`**, so we may need to **`track multiple S3 upload requests`**
* -> **`fileWriteStreamHandler`** receives one parameter of type **formidable.File** interface with properties like **`originalFilename, size, mimetype,...`**

## Implement
* -> start with an **`Array`** to **store and track** all the **`S3 upload request`** _outside the scope of fileWriteStreamHandler_
* -> _inside fileWriteStreamHandler_, we’ll create the **Passthrough stream** that will serve as both the **`Readable body of the S3 upload`** and the **`Writable return value of this function`**
* -> we’ll create the **Upload** request **`using the S3 libraries`**
* -> and tell it our _`bucket name`, the `object key`, the object `Content-Type`, the `Access Control Level` for this object, and the `Passthrough stream` as the request body_
* -> **`instantiate the request`** using **Upload.done()** and add the returned Promise to our **`tracking Array`**
* -> we might want to add the response **`Location property`** to the **`file object`** when the upload completes, so we can use that information later on. 
* -> lastly, we’ll **`return the Passthrough`** stream from this function

* * **waiting all upload requests to finish**
* -> still use "formidable" to **`parse the client request`**
* -> _but instead of resolving the promise immediately_, we can use **Promise.all** to **`wait until all the upload requests have resolved`**

```js
import stream from 'node:stream';
import { S3Client } from '@aws-sdk/client-s3'; // supports uploads
import { Upload } from '@aws-sdk/lib-storage'; // support Readable streams

/**
 * @param {import('http').IncomingMessage} req
 */
function parseMultipartNodeRequest(req) {
  return new Promise((resolve, reject) => {
    /** @type {Promise<any>[]} */
    const s3Uploads = [];

    /** @param {import('formidable').File} file */
    function fileWriteStreamHandler(file) {
      const body = new PassThrough();

      // set up a request to upload the file to our S3-compatible bucket
      const upload = new Upload({
        client: s3Client,
        params: {
            Bucket: 'austins-bucket', // bucket name

            Key: `files/${file.originalFilename}`, 
            // name and location the object will exist, 
            // can include folders that will be created if they do not currently exist
            // if a file exists with the same name and location, it will be overwritten 

            ContentType: file.mimetype,
            // is not required, but it’s helpful to include. 
            // allows browsers to create the downloaded response appropriately based on Content-Type

            ACL: 'public-read',
            // optional, but by default, every object is private
            // set it to public if we want user to be able to access the files via URL

            Body: body, 
            // use the same Passthrough stream as the body of the request
            // so as formidable writes chunks of file data to the Passthrough stream, 
            // they are also read by the S3 upload request
        },
      });

      const uploadRequest = upload.done().then((response) => {
        file.location = response.Location;
      });
      s3Uploads.push(uploadRequest);
      return body;
    }

    const form = formidable({
      multiples: true,
      fileWriteStreamHandler: fileWriteStreamHandler,
    });

    form.parse(req, (error, fields, files) => {
      // as formidable is parsing the request when it comes across a file, 
      // it writes the "chunks of data" from the "file stream" to the "Passthrough" stream 
      // that’s returned from the "fileWriteStreamHandler" function

      if (error) {
        reject(error);
        return;
      }

      // Once formidable has finished parsing the request, 
      // all the chunks of data from the file streams are taken care of, 
      // and we wait for the list of S3 requests to finish uploading
      Promise.all(s3Uploads)
        .then(() => {
          resolve({ ...fields, ...files });
        })
        .catch(reject);
    });
  });
}
// "formidable" becomes the plumbing that connects the "incoming client request" to the "S3 upload request"
// The resolved files value will also contain the location property we included, pointing to the Object Storage URL


export default defineEventHandler(async (event) => {
  let body;
  const headers = getRequestHeaders(event);

  if (headers['content-type']?.includes('multipart/form-data')) {
    body = await parseMultipartNodeRequest(event.node.req);
    // resolve the Promise from parseMultipartNodeRequest 
    // with the modified data from formidable
  } else {
    body = await readBody(event);
  }

  console.log(body); // log data representing the fields and files (not the files themselves)

  return { ok: true };
});
```

* _VD: our original upload request contained a single field called “file1” with the photo of something, we might see something like this:_
```js
// looks very similar to the object formidable returns when it writes directly to disk
// but it has an extra property "location"
// which is the Object Storage URL for our uploaded file
// access the URL from "location" property to view the photo: 'https://austins-bucket.us-southeast-1.linodeobjects.com/files/nugget.jpg'

{
  file1: {
    _events: [Object: null prototype] { error: [Function (anonymous)] },
    _eventsCount: 1,
    _maxListeners: undefined,
    lastModifiedDate: null,
    filepath: '/tmp/93374f13c6cab7a01f7cb5100',
    newFilename: '93374f13c6cab7a01f7cb5100',
    originalFilename: 'nugget.jpg',
    mimetype: 'image/jpeg',
    hashAlgorithm: false,
    createFileWriteStream: [Function: fileWriteStreamHandler],
    size: 82298,
    _writeStream: PassThrough {
      _readableState: [ReadableState],
      _events: [Object: null prototype],
      _eventsCount: 6,
      _maxListeners: undefined,
      _writableState: [WritableState],
      allowHalfOpen: true,
      [Symbol(kCapture)]: false,
      [Symbol(kCallback)]: null
    },
    hash: null,
    location: 'https://austins-bucket.us-southeast-1.linodeobjects.com/files/nugget.jpg',
    [Symbol(kCapture)]: false
  }
}
```

=================================================
# Another way to upload files to S3
* -> use **signed URLs**
* -> **`Signed URLs`** - are basically the **`same URL in the bucket`** where the file will live, 
* -> but they include an **`authentication signature`** that can be used by anyone to upload a file, 
* -> as long as the **`signature has not expired`** (usually quite soon)

* _usually standard practice is to use signed URLs and uploading directly to s3 that way._

## Flow
* Frontend makes a request to the backend for a signed URL.
* Backend makes an authenticated request to the Object Storage provider for a signed URL with a given expiry.
* Object Storage provider provides a signed URL to the backend.
* Backend returns the signed URL to the frontend.
* Frontend uploads the file directly to Object Storage thanks to the signed URL.
* Optional: Frontend may make another request to the Backend if you need to update a database that the upload completed

## Advantages and Disavantages
* **Advantages**:
* -> it moves work off your servers, which can reduce load and improve performance.
* -> it moves the file upload bandwidth off your server. If you pay for ingress and have several large file uploads all the time, this could add up.

* **Disavantages**:
* -> the flow requires a little more choreography than Frontend -> Backend -> Object Storage
* -> You have much less control over what users can upload. This might include malware.
* -> If you need to perform functions on the files like optimizing, you can’t do that with signed URLs.
* -> The complex flow makes it much harder to build an upload flow with progressive enhancement in mind.

