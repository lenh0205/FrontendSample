
# Flux Design pattern Architect bao gồm những gì?
* https://www.freecodecamp.org/news/an-introduction-to-the-flux-architectural-pattern-674ea74775c9/
* https://www.youtube.com/watch?v=LCaH1siSzW4&list=PLillGF-RfqbaevC84ezBcmlfR54H9RaUr

# Tại sao không nên xử lý async thẳng trong reducer:
* xử lý thẳng async trong reducer thì như nào: https://javascript.plainenglish.io/asynchronous-redux-without-middlewares-using-es2017-a42c2699d4d0
* https://www.reddit.com/r/reactjs/comments/17b9qjn/is_it_okay_to_use_async_await_for_redux_action/
* https://redux.js.org/usage/side-effects-approaches#:~:text=By%20itself%2C%20a%20Redux%20store,to%20happen%20outside%20the%20store.
* https://stackoverflow.com/questions/34570758/why-do-we-need-middleware-for-async-flow-in-redux

# Tựu build Flux và async action:
* https://medium.com/capbase-engineering/part-3-the-react-hooks-based-alternative-to-redux-and-the-flux-pattern-a726220a8a9a
* https://github.com/boostup/react-context-api-multiple-reducers-mulitple-sagas/tree/master

# why using Generator for handle Async:
* Basic:
* https://stackoverflow.com/questions/62041213/handling-synchronous-flow-in-async-generators-js
* https://blog.delpuppo.net/javascript-async-generators-unleashed-harnessing-asynchronous-power
* https://javascript.info/async-iterators-generators
* https://dev.to/eugenioenko/demystifying-asynchronous-javascript-with-the-asynq-utility-3c3k
* https://blog.logrocket.com/javascript-generators-the-superior-async-await/

* For react:
* https://medium.com/front-end-weekly/handling-complex-asynchronous-flows-in-react-with-javascript-generators-using-typescript-804d297878b6
* https://www.freecodecamp.org/news/async-generators-as-an-alternative-to-state-management/

* Queue:
* https://samthor.au/2020/async-generators-input/