
# Extracting State Logic into a Reducer
* -> components with **many state updates spread across many event handlers** can get **`overwhelming`**
* -> for these cases, we can **consolidate all the state update logic outside our component in a single function**, called **`a reducer`**

* _nói chung là khi component grows, lượng `state logic bị rải rác khắp nơi`; và ta có thể move tất cả `state update logic` vào 1 function duy nhất nằm ngoài component_
* _this keep the `event handlers` short and concise; decreases the indentation level and can make our code **easier to read**_

===========================================================================

# consolidate state logic with a reducer
* -> as our **components grow in complexity**, it can get **`harder to see at a glance all the different ways`** in which **a component’s state gets updated**
* -> to **`reduce this complexity`** and **keep all our logic in one easy-to-access place**, we can **`move that state logic into a single function outside component`**, called a "reducer"

* -> Reducers are a different way to **handle state**; we can migrate from **`useState`** to **`useReducer`** in three steps: _`Move from setting state to dispatching actions`, `Write a reducer function`, `use the reducer from your component`_

```js - For example:
//  the "TaskApp" component below holds an array of tasks in state 
// uses 3 different event handlers to add, remove, and edit tasks

let nextId = 3;
const initialTasks = [
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];

export default function TaskApp() {
  const [tasks, setTasks] = useState(initialTasks);

  function handleAddTask(text) {
    setTasks([
      ...tasks,
      {
        id: nextId++,
        text: text,
        done: false,
      },
    ]);
  }

  function handleChangeTask(task) {
    setTasks(
      tasks.map((t) => {
        if (t.id === task.id) {
          return task;
        } else {
          return t;
        }
      })
    );
  }

  function handleDeleteTask(taskId) {
    setTasks(tasks.filter((t) => t.id !== taskId));
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

```

## Step 1: Move from setting state to dispatching actions
* _l **`managing state with reducers`** is slightly different from **`directly setting state`**_
* -> instead of **telling React "what to do"** by **`setting state`**
* -> we **specify "what the user just did"** by **`dispatching "actions" from your event handlers`**; **the state update logic will live elsewhere!**
* => this is more descriptive of the **`user's intent`**

* _**action** - the object we pass to "dispatch"_
* -> by convention, it is common to give it a **"type" properties** with string value to **`describes what happened`**; and **`pass any additional information in other fields`**

```js
// So instead of "setting tasks" via an event handler, we're dispatching an "added/changed/deleted a task" action 
 
function handleAddTask(text) {
  dispatch({
    type: 'added',
    id: nextId++,
    text: text,
  });
}

function handleChangeTask(task) {
  dispatch({
    type: 'changed',
    task: task,
  });
}

function handleDeleteTask(taskId) {
  dispatch({
    type: 'deleted',
    id: taskId,
  });
}
```

## Step 2: Write a reducer function
* -> **`a reducer function`** is where we will **put state logic**; 
* -> it takes **`two arguments`**, the **current state** and the **action object**, and it **returns the next state**
* -> **React will set the state** to what we **`return from the reducer`**

* _**convention**:_ 
* -> use **switch statement** inside reducers; 
* -> **`wrapping each "case" block`** into the **curly braces "{}"** so that variables declared inside of different "case" don’t clash with each other
* -> a case should usually end with a **return**; if we forget to return, **`the code will "fall through" to the next case`**, which can lead to mistakes!

```js
// declare the "current state" (tasks) as the "first argument"; declare the action object as the second argument
// return the next state from the reducer (which React will set the state to)

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

## Step 3: Use the reducer from your component 

```js
import { useReducer } from 'react';

// const [tasks, setTasks] = useState(initialTasks);
const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
```

===========================================================================

# when using "useReducer" instead of "useState"
* _React recommend using a reducer if we often **`encounter bugs due to incorrect state updates`** in some component, and want to **`introduce more structure to its code`**_

## Code size
* -> generally, with **useState** we have to **`write less code upfront`**
* -> with **useReducer**, we have to **`write both a "reducer function" and "dispatch actions"`**
* => however, useReducer can help **cut down on the code if many event handlers modify state in a similar way**

## Readability
* -> **useState** is very **`easy to read when the state updates are simple`**; when they get more complex, they can **`bloat your component’s code and make it difficult to scan`**
* -> in this case, **useReducer** lets us cleanly **`separate the how of update logic from the what happened of event handlers`**

## Debugging
* -> when we have a bug with **useState**, it can be difficult to tell **`where the state was set incorrectly, and why`**
& -> with **useReducer**, we can **`add a console log into our reducer`** to see every state update, and why it happened (**`due to which action`**)
* => if each action is correct, we’ll know that the mistake is in the reducer logic itself
* => however, we have to step through more code than with useState

## Testing
* -> **`a reducer`** is **a pure function** that **`doesn’t depend on component`**
* => this means that we can **`export and test it separately in isolation`**
* -> while generally it’s best to test components in a more realistic environment, for **`complex state update logic`** it can be useful to assert that your reducer returns a particular state for a particular initial state and action.

## Personal preference
* -> Some people like reducers, others don’t; that’s okay. It’s a matter of preference
* -> we can **`always convert between useState and useReducer`** back and forth: **they are equivalent!**

===========================================================================

# Writing reducers

## Reducers must be pure
* -> similar to **`state updater functions`**, reducers run during rendering! (Actions are queued until the next render.) 
* -> this means that reducers must be pure - **same inputs always result in the same output**
* -> they should not **`send requests, schedule timeouts, or perform any side effects`** (**operations that impact things outside the component**)
* -> they should **update objects and arrays without mutations**

## Each action describes a single user interaction, even if that leads to multiple changes in the data
* -> _for example, if a user presses `Reset` on a form with `five fields` managed by a reducer, it makes more sense to dispatch `one reset_form action` rather than `five separate set_field actions`_
* -> if we log every action in a reducer, that **log should be clear** enough for us to **`reconstruct what interactions or responses happened in what order`** (_this helps with debugging_)