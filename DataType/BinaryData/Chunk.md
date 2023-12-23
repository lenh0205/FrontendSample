# Chunk
* -> a **small piece of binary data** that travels from _source to destination_ using **stream** to transfer 
* -> contain **`all the information about the binary data`** such as _which chunks need to be processed_ and _which chunks do not need to be processed_
* -> **Every chunk is a Buffer instance**

* **Mechanism**
* -> data is a transfer from server to client for a particular request in the form of **`a stream`** - the stream contains **`chunks`**
* ->  a chunk is a **`fragment of the data`** that is sent by the client to server 
* -> all chunks concepts to each other to make a **`buffer of the stream`**, then the buffer is converted into _meaningful data_

```js - send chunks from the request body to the server
// the request object is used for handling the chunks of data

const http = require('http'); 
// Creating a server 
const server = http.createServer((req, res) => { 
    const url = req.url; 
    const method = req.method; 
  
    if (url === '/') { 
        // Sending the response 
        res.write('<html>'); 
        res.write('<head><title>Enter Message</title><head>'); 
        res.write(
            `<body>
                <form action="/message" method="POST"> 
                    <input type="text" name="message"></input> 
                    <button type="submit">Send</button>
                </form>
            </body>`
        ); 
        res.write('</html>'); 
        return res.end(); 
    } 
  
    if (url === '/message' && method === 'POST') { 
        const body = []; 
        req.on('data', (chunk) => { 
            // Storing the chunk data 
            body.push(chunk); 
            console.log(body) 
        }); 
  
        req.on('end', () => { 
            // Parsing the chunk data 
            const parsedBody = Buffer.concat(body).toString(); 
            const message = parsedBody.split('=')[1]; 
              
            // Printing the data 
            console.log(message); 
        }); 
        res.statusCode = 302; 
        res.setHeader('Location', '/'); 
        return res.end(); 
    } 
}); 
server.listen(3000); // Starting the server 
```