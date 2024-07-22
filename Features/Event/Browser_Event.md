# Event
* https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events

```js - Ex: Listen for changes with localStorage on the same window
const originalSetItem = localStorage.setItem;

localStorage.setItem = function(key, value) {
  const event = new Event('itemInserted');

  event.value = value; // Optional..
  event.key = key; // Optional..

  document.dispatchEvent(event);

  originalSetItem.apply(this, arguments);
};

const localStorageSetHandler = function(e) {
  alert('localStorage.set("' + e.key + '", "' + e.value + '") was called');
};

document.addEventListener("itemInserted", localStorageSetHandler, false);

localStorage.setItem('foo', 'bar'); // Pops an alert
```