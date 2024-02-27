
# Streams
* -> is **`a sequence of data`** that being **`moved from one point to another over time`**
* -> we will **`process streams of data`** in **chunks** **`as they arrive`** instead of waiting for the entire data to be available before processing 
* => prevent unnecessary data downloads and memory usage

* _về cơ bản, ta sẽ làm việc với data theo những `chunk` nhỏ thay vì đợi toàn bộ data có mặt 1 lần_

```r - some stream
// a tream of data over the internet being move from one computer to another
// a stream of data being transfered from one file to another within the same computer
```

```r - watching a video on YouTube
// we dont wait for the entire video to be downloaded to watch it
// the data arrives in "chunks", and we watch the video in chunks; while the rest of the data arrives over time
```

```r - transfer "file contents" from fileA to fileB
// we dont wait for the "entire fileA content" to be "saved in temporary memory" before moving it into fileB
// the contents arrive in chunks and it will be tranfered in chunks to fileB, while the remaining contents arrive over time
```
=======================================================
# How Stream being moved - Buffer

## An analogy to buffer
```r  
// Situation - a roller coaster have "seating capacity" for 30 peoples
// Problem - we can not control what pace people arrive at the roller coaster
// Ability - we can only decide when is the right time to send people on the ride

// Scenarios 1: if 100 people arrive at a time; 30 are accommodated and the remaining 70 have to wait in line for next round
// Scenarios 2: if only 1 person arrive; the person has to wait in line for at least 10 people to arrive in total (that is a guideline set to "improve efficiency")

// => if people are already on the ride or there are too few of people to start the ride, we have to have to have people arriving wait in line
// => the area where people wait is called "buffer" 
```

## Buffer
* -> NodejS can't control the pace at which data **`arrives in the stream`**
* -> it can only decide **`when is the right time`** to **`send data for processing`**
* -> if there is data already **`being processed`** or **`too little data to process`**, Node **puts the arriving data a buffer**
* -> it's an **`intentionally small area`** that Node **`maintains in the runtime`** to **`process a stream of data`**

* _NodeJS usually internally use buffers where required, so we might never have to work with buffer directly_
* => we could have learned about **`fs`** and **`http`** module without understanding about buffers in this level of detail 

```r - streaming a video online
// if our internet is fast enough, the speed of stream will be fast enough to instantly fill up the buffer and send it out for processing
// that will repeat till the stream is finished

// if our connection is slow, after processing the first chunk of data that arrived, the video player will display a "loading spinner" which indicates it is waiting for more data to arrive
// once the buffer is filled up and the data is processed, the video player shows the video

// while the video is playing, more data will continue to arrive and wait in buffer
```

