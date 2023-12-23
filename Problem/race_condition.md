# Race Condition
* tình huống xảy ra khi nhiều threads cùng truy cập và cùng lúc muốn thay đổi dữ liệu (có thể là một biến, một row trong database, một vùng shared data, memory , etc...)
* -> không thể biết được thứ tự của các threads truy cập và thay đổi dữ liệu đó sẽ dẫn đến giá trị của data sẽ không như mong muốn. 
* -> kết quả sẽ phụ thuộc vào thuật toán thread scheduling của hệ điều hành
* https://bizflycloud.vn/tin-tuc/race-condition-la-gi-lam-sao-de-khai-thac-20180116193609705.htm

============================================
# Race Condition in React
* **`making multiple API calls`** or **`performing asynchronous operations`**
* -> then there are chances that the UI can **update/render in glitch**
* -> as the **`later call may resolve first and the first API call may resolve later`**

# 2 Solution:
* -> **`useEffect hook using flag`** - still making several requests, but only rendering the last result
* -> **`Cancelling the API request`** using **AbortController()** with _clean-up function_
* -> _CancelToken đã bị deprecated_

## useEffect hook using flag
* In React, **if a component renders multiple times (as they typically do), the previous effect is cleaned up before executing the next effect**
* -> ta có thể s/d **`clean-up function`** của useEffect() - được gọi trước khi component re-render lần tiếp theo
* -> để thay đổi cái `flag` mà Promise tham chiếu đến

```js - tất cả "active" sẽ là "false" trừ cái cuối vì component đã được Unmounted đâu
// In fetching data with useEffect if "id" changed fast enough, component that could have a race condition:
// changing "props.id" will cause a re-render
// every re-render will trigger the clean-up function to run, setting "active" to false,
// with "active" set to false, the now-stale requests won't be able to update our state

useEffect(() => {
  let active = true;

  const fetchData = async () => {
    setTimeout(async () => {
      const response = await fetch(`https://swapi.dev/api/people/${props.id}/`);
      const newData = await response.json();
      if (active) {
        setFetchedId(props.id);
        setData(newData);
      }
    }, Math.round(Math.random() * 12000));
  };
  fetchData();

  return () => {
    active = false;
  };
}, [props.id]);
```

## Cancelling the API request using "AbortController()"
* use **`AbortController`** - **a JavaScript web API method**
* -> it has a property called **`signal`** - allow to create an **`AbortSignal`**
* -> an _AbortSignal_ be associated with the Fetch API which provides an **`option to abort the API request`**
* -> we can invoke the abort to cancel the API request in useEffect **`clean-up`** function

### Process:
* -> initialising an built-in **`AbortController`** _object_ at the start of the effect
* -> passing the **`AbortController.signal`** to _Fetch_ via the options argument
* -> when **`AbortController.abort()`** get called, the _Fetch() promise_ will **`reject with an AbortError object`**
* -> calling the abort function inside the clean-up function

```js - tất cả request có "abort signal" sẽ bị cancel trừ cái cuối vì component đã được Unmounted đâu
useEffect(() => {
  const abortController = new AbortController();

  const fetchData = async () => {
    setTimeout(async () => {
      try {
        const response = await fetch(`https://swapi.dev/api/people/${id}/`, {
          signal: abortController.signal,
        });
        const newData = await response.json();
        setFetchedId(id);
        setData(newData);
      } catch (error) {
        if (error.name === 'AbortError') {
          // Aborting a fetch throws an error
          // So we can't update state afterwards
        }
        // Handle other request errors here
      }
    }, Math.round(Math.random() * 12000));
  };
  fetchData();

  return () => {
    abortController.abort();
  };
}, [id]);
```

### Tradeof
*  drop support for _Internet Explorer/use a polyfill_, in exchange for the ability to **`cancel in-flight HTTP requests`**
* => avoid wasting user bandwidth 

================================================
# Request Cancellation 
* In some cases an axios call would **`benefit from cancelling the connection`** early (_VD: (e.g. network connection becomes unavailable_)
* -> Without cancellation, the axios call can hang until the **`parent code/stack times out`** (_might be `a few minutes` in a server-side applications_)
* -> combine **timeout** and **signal** (_the cancel request method_) should cover **`response related timeouts`** and **`connection related timeouts`**

```js - normal canceling
const controller = new AbortController();

axios.get('/foo/bar', { signal: controller.signal })
  .then(function(response) {
    //...
  });

controller.abort(); // cancel the request
```

```js - cancel after 5s
// Sử dụng "AbortSignal.timeout" API
axios.get('/foo/bar', {
   signal: AbortSignal.timeout(5000) //Aborts request after 5 seconds
}).then(function(response) {
   //...
});


// hoặc tự viết 1 "timeout helper function":
function newAbortSignal(timeoutMs) {
  const abortController = new AbortController();
  setTimeout(() => abortController.abort(), timeoutMs || 0);
  return abortController.signal;
}
axios.get('/foo/bar', {
   signal: newAbortSignal(5000) //Aborts request after 5 seconds
}).then(function(response) {
   //...
});
```