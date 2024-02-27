
# Chunks
* -> is **a single piece of data** that is **`written to or read from a stream`**
* -> It can be of **`any type`**; **streams** can even **`contain chunks of different types`** 
* -> most of the time, a chunk will not be the most atomic unit of data for a given stream (_Ex: a byte stream might contain chunks consisting of 16 KiB Uint8Array units_)

# Readable streams
* -> represents **`a source of data from`** which we can read
* -> in other words, **`data comes out of a readable stream`**
* -> concretely, a readable stream is an instance of the **ReadableStream** class.

# Writable streams
* -> represents a destination which we can write for data into. In other words, data goes in to a writable stream. Concretely, a writable stream is an instance of the WritableStream class.

# Transform streams
A transform stream consists of a pair of streams: a writable stream, known as its writable side, and a readable stream, known as its readable side. A real-world metaphor for this would be a simultaneous interpreter who translates from one language to another on-the-fly. In a manner specific to the transform stream, writing to the writable side results in new data being made available for reading from the readable side. Concretely, any object with a writable property and a readable property can serve as a transform stream. However, the standard TransformStream class makes it easier to create such a pair that is properly entangled.

# Pipe chains
Streams are primarily used by piping them to each other. A readable stream can be piped directly to a writable stream, using the readable stream's pipeTo() method, or it can be piped through one or more transform streams first, using the readable stream's pipeThrough() method. A set of streams piped together in this way is referred to as a pipe chain.

# Backpressure
Once a pipe chain is constructed, it will propagate signals regarding how fast chunks should flow through it. If any step in the chain cannot yet accept chunks, it propagates a signal backwards through the pipe chain, until eventually the original source is told to stop producing chunks so fast. This process of normalizing flow is called backpressure.

# Teeing
A readable stream can be teed (named after the shape of an uppercase 'T') using its tee() method. This will lock the stream, that is, make it no longer directly usable; however, it will create two new streams, called branches, which can be consumed independently. Teeing also is important because streams cannot be rewound or restarted, more about this later.