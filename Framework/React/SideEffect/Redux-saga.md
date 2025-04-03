https://dev.to/jolanglinais/asynchronous-with-redux-sagas-44dm
https://dev.to/nodefiend/react-async-await-api-layer-with-redux-sagas-1893
https://redux-saga.js.org/docs/introduction/BeginnerTutorial/
https://redux-saga.js.org/docs/basics/DeclarativeEffects/

=========================================================================
# Saga
https://redux-saga.js.org/docs/introduction/SagaBackground

=========================================================================
# Redux-saga
* -> orchestrating the **`side-effects`**
* -> Sagas similar to **normal reducers**, are functions which **`listen for dispatched actions`** but **`perform side effects`**, and **`return their own actions back to the normal reducer`**
* => therefore, **`any time that we want to run a side-effect we should do it by yielding the side-effect`** through a **redux-saga effect (usually: call or fork)**
* => the redux-saga generator is completely **testable** without the need of mocking anything.
* => also, it helps to keep things **decoupled** (_if our fetchAPI function returned a promise, the saga would still work the same_)

## Redux-saga vs Generator
* -> a **plugin for redux** that **`runs generator-based functions in response to redux actions`**
* -> a **generator function** is invoked, it returns an **iterator object** - **each subsequent next() method call will execute the generator until the next yield statement and pause`**
* 
* => allow for synchronously written asynchronous code; **`automatically pause (or yield) at each asynchronous call until it completes before continuing`**
* => if we 'yield' a promise, redux-saga will **unwrap the promise** for us and **throw a catchable error** if the promise rejects

## Generator vs Async/Await
* _basically, we can transpile async/await into generators, but we can't do the reverse_
* -> they're similar, but the fact remains that **generators are considerably more powerful** for **`advanced users`** - because of the **`fine-grained control over execution flow**
* => with the generator, Redux-Saga can **pause execution at any point (yield)**, **resume execution only when needed (next)**, **inject new data into the function (gen.next(data))**, **cancel execution at any time**
* => as a userland library, redux-saga **can handle asynchronous behavior in ways that async/await doesn't** (_Ex: **`takeLastest()`**_)

```cs
// Ex: khi ta run background tasks (Polling data, WebSockets, Debouncing/throttling) trong 1 async function
// thì khi request done nó sẽ execute tiếp phần code bên dưới, nhưng có những trường hợp ta không cần giá trị trả về từ response nữa và execute đoạn code bên dưới nữa (VD: giờ ta redirect sang trang khác)
// generator có  thể giúp ta cancel ngay đoạn gửi request, không cần phải execute tiếp (nhưng không cancel request, nếu muốn đòi hỏi phải có AbortController)
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

## Example to illustrate power of 'Generator' - illustrating 'takeLastest()' mechanism
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

## Other practical scenarios
* -> whether using takeLatest() in Redux-Saga is always the best approach, but still there are cases where taking only the first action would be better
 
* -> **takeLastest** is great for **`Autocomplete`** (where only the latest search query matters) and **`Fetching API data`** (where you always want the latest request and discard older ones)
* Ex: a search box with autocomplete that dispatches an action every time the user types; when user type "hello" only SEARCH("hello") will be processed while previous ones ("h", "he", "hel", "hell") are cancelled

* -> but there is a case process only the first action and ignore subsequent ones until it completes - Redux-Saga don't support "takeFirst" API
* Ex: **`form submissions`**, where you only want one submission to happen and ignore rapid clicks

```js
// implement middleware to ensure only one instance runs at a time 
const fetch = require('node-fetch');
const { createStore, applyMiddleware } = require('redux');
const util = require('util');

const inflight = {};
const dedupeMiddleware = store => next => action => {
  if (action.payload == null || action.payload.constructor.name !== 'AsyncFunction') {
    // If `action.payload` isn't a function, we can't really cancel this action, and
    // if this function isn't async then assume it is sync
    return next(action);
  }
  if (inflight[action.type]) {
    // Ignore if there's an action with this type already in progress
    return;
  }

  inflight[action.type] = true;
  action.payload(action).then(
    () => { inflight[action.type] = false; },
    () => { inflight[action.type] = false; }
  );
  next(action);
};

const store = createStore(reducer, applyMiddleware(dedupeMiddleware));

store.dispatch({ type: 'FETCH_USER', name: 'vkarpov15', id: 1, payload: fetchUser });
setImmediate(() => store.dispatch({ type: 'FETCH_USER', name: 'vkarpov15', id: 2, payload: fetchUser }));

async function fetchUser({ name, id }) {
  try {
    let user = await fetch(`https://api.github.com/users/${name}`);
    user = await user.json();
    store.dispatch({ type: 'FETCH_USER_SUCCESS', user, id });
  } catch (error) {
    store.dispatch({ type: 'FETCH_USER_ERROR', error, id });
  }
}

function reducer(state = {}, action) {
  // Prints:
  // "Action { type: '@@redux/INITy.d.z.l.g' }"
  // "Action { type: 'FETCH_USER', name: 'vkarpov15', id: 1, payload: [AsyncFunction: fetchUser] }"
  // "Action { type: 'FETCH_USER_SUCCESS', user: [Object], id: 1 }"
  // 2nd action is ignored!
  console.log('Action', util.inspect(action, { colors: true, depth: 0 }));
  switch (action.type) {
    case 'FETCH_USER_SUCCESS': return Object.assign({}, state, action);
    case 'FETCH_USER_ERROR': return Object.assign({}, state, action);
  }
  return state;
}
```

=========================================================================
# Redux-Saga vs Thread
* Redux Saga is not actually running on a separate thread; sagas are built with generator functions
* -> it lets us write "background thread-like" behavior ("fork off this child function", "cancel that task", "wait for something else to occur")
* -> even though there's really only one JS thread of execution
