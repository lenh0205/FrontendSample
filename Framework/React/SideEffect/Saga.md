
* Redux Saga is not actually running on a separate thread; sagas are built with generator functions
* -> it lets us write "background thread-like" behavior ("fork off this child function", "cancel that task", "wait for something else to occur")
* -> even though there's really only one JS thread of execution