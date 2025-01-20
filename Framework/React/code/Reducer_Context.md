# Scaling Up with Reducer and Context
* -> **Reducers** let us **`consolidate a component’s state update logic`**
* -> **Context** lets us **`pass information deep down to other components`** 
* -> combine reducers and context together to **manage state of a complex screen**

## Combining a reducer with context
* -> a reducer helps **`keep the event handlers short and concise`**
* -> however, as our app grows, we might run into another difficulty - currently, the **state and the dispatch function are **only available in the top-level component**
* -> to let **`other components read the state or change it`**, we have to explicitly pass down the **current state** and the **event handlers** that change it as props
```js
<TaskList
  tasks={tasks}
  onChangeTask={handleChangeTask}
  onDeleteTask={handleDeleteTask}
/>
```

* 