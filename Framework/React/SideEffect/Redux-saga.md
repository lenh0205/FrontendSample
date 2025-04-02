
# Redux-saga
* -> a **plugin for redux** that **`runs generator-based functions in response to redux actions`**
* => if we 'yield' a promise, redux-saga will unwrap the promise for you and throw a catchable error if the promise rejects

## Generator vs Async/Await
* -> they're similar, but the fact remains that **`generators are considerably more powerful for "advanced" users`**
* -> basically, we can transpile async/await into generators, but we can't do the reverse
* => as a userland library, redux-saga **can handle asynchronous behavior in ways that async/await doesn't** (_Ex: **takeLastest()**_)

## Example to illustrate power of 'Generator' - takeLastest()
* -> we **`can't abort/cancel an async function once it has started`** unless the async function errors or returns
* -> however, because redux-saga uses generators, it is **responsible for calling generator.next()** to continue the function after the function yields
* => so **`cancellation is easy`**: just add an early return and don't call generator.next()
 
```js
const fetch = require('node-fetch');
const util = require('util');

// Prints:
// "{ type: 'FETCH_USER_SUCCESS', user: [Object], id: 2 }"
const put = action => console.log(util.inspect(action, { colors: true, depth: 0 }));

function* saga(action) {
  try {
    let user = yield fetch(`https://api.github.com/users/${action.name}`);
    user = yield user.json();
    yield put({ type: 'FETCH_USER_SUCCESS', user, id: action.id });
  } catch (error) {
    yield put({ type: 'FETCH_USER_ERROR', error, id: action.id });
  }
}

// example of how we can make a generator cancellable
// -> định nghĩa function "next" để chạy đệ quy,
// -> mỗi lần resolve 1 promise của yield trong generator thì sẽ chạy vòng lặp tiếp theo
// -> trong mỗi vòng lặp check "cancelled" nếu false sẽ gọi "generator.next()", true thì dừng
// -> return 1 function để update biến "cancelled"
const cancellable = function(generator) {
  let cancelled = false;
  next();

  function next(v) {
    // was `cancel()` called? If so, don't go on to the next step
    if (cancelled) {
      return;
    }
    // otherwise, go through to the next step and check for promises
    const { value, done } = generator.next(v);
    if (done) {
      return;
    }
    if (value != null && typeof value.then === 'function') {
      return value.then(
        res => next(res),
        err => generator.throw(err)
      );
    }
    next(value);
  }

  return { cancel: () => cancelled = true };
};

const call1 = cancellable(saga({ name: 'vkarpov15', id: 1 }));

setImmediate(() => {
  cancellable(saga({ name: 'vkarpov15', id: 2 }));

  // this will cancel the first action while the `fetch()` is in flight,
  // so it will never dispatch a 'FETCH_USER_SUCCESS' action
  call1.cancel();
});
```

## Example of using Redux-saga
```js
// Example: Node.js use redux-saga to fetch() data from the GitHub API and put it in a redux store:
// -> cơ bản thì logic để update state là synchronous và nằm trong reducer
// -> còn các logic cần asynchronous thì ta bỏ hết vào Saga - a generator function
// -> nó cũng khá giống async function rồi await promise nhưng thay bằng function* và yield promise
// -> bằng việc sử dụng yield nó cho phép ta sử dụng những function như "takeLastest", "put"

const fetch = require('node-fetch');
const { createStore, applyMiddleware } = require('redux');
const { call, put, takeLatest } = require('redux-saga/effects');
const util = require('util');

// register 'Saga' middleware, reducer in Redux store
// -> "reducer" là 1 synchronous function hoạt động như 1 callback
// -> 'Saga' middleware xử lý các task async và sử dụng callback này khi resolve 1 promise
const sagaMiddleware = require('redux-saga').default();
const store = createStore(reducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(initSagas);

// root Saga to be provided to Saga Middleware
// -> to map sagas to action types 
// -> this function will ensure that `saga` runs every time a `FETCH_USER` action comes in
function* initSagas() {
  // only one `FETCH_USER` action can run at a time:
  yield takeLatest('FETCH_USER', saga);
}

// define reducer
function reducer(state = {}, action) {
  console.log('Action', util.inspect(action, { colors: true, depth: 0 }));
  // "Action { type: '@@redux/INIT6.j.8.1.9' }"
  // "Action { type: 'FETCH_USER', name: 'vkarpov15' }"
  // "Action { type: 'FETCH_USER_SUCCESS', user: [Object] }"

  switch (action.type) {
    case 'FETCH_USER_SUCCESS': return Object.assign({}, state, action);
    case 'FETCH_USER_ERROR': return Object.assign({}, state, action);
  }
  return state;
}

// dispatch a Redux action
// -> dispatch 2 nearly simultaneous "FETCH_USER" actions
// -> the "takeLatest()" in "initSagas" ensures that only the latest "FETCH_USER" action runs through to completion
// -> trong log của Reducer ta sẽ thấy first "FETCH_USER" action bị cancel nên we only get one 'FETCH_USER_SUCCESS' action with `id = 2`
store.dispatch({ type: 'FETCH_USER', name: 'vkarpov15' });
setImmediate(() => store.dispatch({ type: 'FETCH_USER', name: 'vkarpov15', id: 2 }));

// define a "saga" for handle "FETCH_USER" action logic 
// -> a "saga" is a generator function that yields promises or redux-saga objects (like the return value of `put()`)
function* saga(action) {
  // if `fetch()` fails, redux-saga will throw a catchable error
  try {
    let user = yield fetch(`https://api.github.com/users/${action.name}`);
    user = yield user.json();

    // `put()` is redux-saga's wrapper around `store.dispatch()`
    yield put({ type: 'FETCH_USER_SUCCESS', user });
  }
  catch (error)
  {
    yield put({ type: 'FETCH_USER_ERROR', error });
  }
}
```

## 

## Redux-Saga vs Thread
* Redux Saga is not actually running on a separate thread; sagas are built with generator functions
* -> it lets us write "background thread-like" behavior ("fork off this child function", "cancel that task", "wait for something else to occur")
* -> even though there's really only one JS thread of execution
