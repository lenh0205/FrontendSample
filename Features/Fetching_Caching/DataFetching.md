# React RESTful data fetching
* ask a networking client to fetch data by mentioning the RESTful endpoint 

## old-school way - Fetching server-provided data
* -> data is embedded in the HTML sent from the server
* -> to fesh data, refresh the page manually or have the page refresh periodically
```html
<meta http-equiv="refresh" content="30">
```
* _if `JavaScript is disabled` or you must deal with ancient browsers, it may even be the best approach because is very simple and straightforward_

===============================================
## Fetching Data using Lifecycle method
* -> it was conventional to fetch initial data in the **componentDidMount()**
* -> and fetch data based on prop or state changes in **componentDidUpdate()** 

* **`componentWillMount()`** gets called when the component is about to be mounted and starts data fetching earlier to save time 
* -> but it’s `deprecated` as of React 17
* -> React will render without waiting for it to finish and will `cause an empty render` for the first time 

* autonomous components are too much of a black box - mix two very different concerns of `data fetching` and `data display` and are more difficult to test
```js
class UserTableAutonomous extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFetching: false, // not fetching yet
            users: []
        };
    }

    // invoked as soon as the component gets mounted
    // -> make a request to search with "query" param
    // -> update the state based on the response
    componentDidMount() {
        const fetchData = async () => {
            const response = await this.fetchUsers();
            const data = await response.json();
            this.setState({ data });
        };
        fetchData();
    }

    // invoked when there’s a state change in the component
    // -> use condition to prevent method get invoked every time set data in state
    componentDidUpdate(previousProps, previousState) {
        if (previousState.query !== this.state.query) {
            const fetchData = async () => {
                const response = await this.fetchUsers();
                const data = await response.json();
                this.setState({ data });
            };
            fetchData();
        }
    }

    componentWillUnmount() { // called when our component goes away
        clearInterval(this.timer); // clear the timer
        this.timer = null;
    }

    async fetchUsers() {
        try {
            this.setState({...this.state, isFetching: true}); // start fetching
            // TODO: fetch data using Fetch(), Axios....
            this.setState({users: response.data, isFetching: false}); // end fetching
        } catch (e) {
            console.log(e)
        }
    }
    render() {
        return (
            <div>
                <p>{this.state.isFetching ? 'Fetching users...' : ''}</p> 
                <table>
                    <tbody>
                        {this.state.users.map((user, index) => (
                        <tr key={index} className={rowClassNameFormat(index)}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.username}</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }
}

// do initial data fetching in the "constructor" will delay the first render of your component
```

=================================================
## fetch data in "Higher-Order Components"
* -> Higher-order components are `composite components`
* -> top-level component is responsible for fetching the data and propagating it to child components

* The **basic idea is to isolate the concern** of **`fetching and distributing data`** from the concern of actually **`doing something with the data`**
* -> In scenarios where multiple components need different aspects of the data, it is also `more efficient because you only fetch the data once`
* -> _Several descendant components may receive different parts of the fetched data, while other components in the hierarchy may not use the data at all_

* The child component 
* -> knows nothing about servers, lifecycle methods, data fetching, or error handling; 
* -> it just receive the users list in its props and render them using the HTML <table> element

* **`SimpleUserTable`**
* -> care only about id, name, username of user object 
* -> If the backend server adds more info or removes/renames some unused fields, this is totally fine
```js
const SimpleUserTable = (props) => {
    return (
        <div>
            <table>
                <tbody>
                {props.data.map((user, index) => (
                   <tr key={index} className='Gold-Row'>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.username}</td>
                   </tr>
                ))}
                </tbody>
            </table>
            <p>{props.isFetching ? 'Fetching users...' : ''}</p>
        </div>
    )
};
```

**`UserTableHOC`**
* -> fetches the users in its `componentDidMount` by calling the `fetchUsers()` method
* -> `render() method simply passes the state` to the child SimpleUserTable
```js
class UserTableHOC extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFetching: false,
            users: []
        };
    }
    componentDidMount() {
        this.fetchUsers();
    }
    render = () => (
        <SimpleUserTable data={this.state.users} isFetching={this.state.isFetching}/>
    );
}
```

* **Problem:**
* -> HOC is not only responsible for fetching data, it is also responsible for rendering the components directly below it in the hierarchy 
* -> and potentially responding to events originating from these children
```js 
// For example, if we want to enable user selection and then displaying the full info of the selected user in another component 
// there is some works we have do, such as informing the HOC about selections in child components and passing fetched data through props of deeply nested component hierarchies.
```

* **Solution**: implement a generic data fetcher that _`knows nothing about what is supposed to do something with the data`_ (in children)
* => **`Render Props pattern`**

### fetch data in "Render Props" React pattern
* **`use a layer of indirection`**
* ->  **pass a function a prop** to a component (_not a static value or object_)
* -> ability to _`deeply customize`_ the way the _`target component`_ works by **replacing parts of its logic with our function**

```js
// code of "UserTableRenderProps" component is similar to "UserTableHOC"
// but the different is in the render() method, which calls its props.children() function

 <UserTableRenderProps children={SimpleUserTable}/>

class UserTableRenderProps extends Component {
    // ...........

    render = () => this.props.children(this.state);
}
```

=============================================
## Fetching data with React Hooks

* Patterns such as `higher-order components` and `render props`
* -> require to **`restructure component hierarchy`**
* -> and/or propagate a lot of state through your hierarchy (_either directly with props or with various wrappers, providers, and consumers_)

* **useEffect()** is like the combination of both **`componentDidMount`** and **`componentDidUpdate`** lifecycle methods _in a cleaner way_

```js
const [status, setStatus] = useState('idle');
const [query, setQuery] = useState('');
const [data, setData] = useState([]);

useEffect(() => {
    if (!query) return;

    const fetchData = async () => {
        setStatus('fetching');

        const response = await fetchUsers();
        const data = await response.json();

        // set the "data" before set "status = fetched" 
        // -> to prevent a flicker which occurs as a result of the data being empty 
        // -> tranfer from Loading UI to real UI
        setData(data.hits);
        setStatus('fetched');
    } 
    fetchData();
}, [query]);
```

### Encapsulate useEffect fetching logic into custom hooks - useFetch
```js - 
const useFetch = (url) => {
    const [status, setStatus] = useState('idle');
    const [data, setData] = useState([]);

    useEffect(() => {
        if (!url) return;
        
        const fetchData = async () => {
            setStatus('fetching');
            const response = await fetch(url);
            const data = await response.json();
            setData(data);
            setStatus('fetched');
        };
        fetchData();
    }, [url]);

    return { status, data };
};
```

### Problem and Solution - Caching Layer
* **Drawback:**
* If we use a data fetching component several times, our React app will **`send the same network request multiple times`**
* components will **`display the loading indicator`** initially whenever they get rendered or rerendered until the data fetching requests get completed
* we will have to define state variables for **`tracking the loading state and errors ourselves`**

* **Solution**: implement a **caching layer** between data rendering and fetching
* => **`React SWR`** and **`TanStack Query`** (_@tanstack/react-query_) are popular caching libraries in the React ecosystem

### Memoization - Cache
* -> save the number of requests to the same endpoint
* -> storing the result of expensive fetch calls will save the users some load time; increasing overall performance

```js - cacheKey là "url"; cache until component unmount; useRef for maintain "cache state"
// We can declaring cache outside of "useFetch" (in a different scope works) 
// -> but it makes this hook no longer a pure function
// -> React can't cleaning up our mess data when we no longer want to make use of the component

// => so use "useRef()" instead
// -> allows to persist values between renders 
// -> is theoretically used to store a mutable value that does not "cause a re-render when updated"

const useFetch = (url) => {
    const cache = useRef({});
    const [status, setStatus] = useState('idle');
    const [data, setData] = useState([]);

    useEffect(() => {
        // ta nên để bước check này inside useEffect thay vì đắt trước useEffect
        // vì it's best practice to "always call hooks at the top level"
        if (!url) return;

        const fetchData = async () => {
            setStatus('fetching');
            if (cache.current[url]) {
                const data = cache[url];
                setData(data);
                setStatus('fetched');
            } else {
                const response = await fetch(url);
                const data = await response.json();
                cache.current[url] = data; 
                setData(data);
                setStatus('fetched');
            }
        };
        fetchData();
    }, [url]);

    return { status, data };
};
```

### switching "useState()" to "useReducer()" to clean-up logic:
* _Solve 2 problems_:
* -> **`unit test could fail`** as a result of the data array not being empty while we’re in the fetching state (React could actually batch state changes but it can’t do that if it’s triggered asynchronously);
* -> **`app will re-renders more than it should`**

* => because we now get to **set the status and data at the same time, so it'll prevent impossible states and unnecessary re-renders**

* also remember to **cleaning up our side effect** to prevent _race conditions_ by **`using clean up function of useEffect()`**
* -> in the case that our Component get unmounted; but a Promise in on pending
* -> then when Promise is resolved/rejected, it'll setState 
* -> React would return error **`Can't perform a React state update on an unmounted component`**

```js
const initialState = {
    status: 'idle',
    error: null,
    data: [],
};
const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
        case 'FETCHING':
            return { ...initialState, status: 'fetching' };
        case 'FETCHED':
            return { ...initialState, status: 'fetched', data: action.payload };
        case 'FETCH_ERROR':
            return { ...initialState, status: 'error', error: action.payload };
        default:
            return state;
    }
}, initialState);

useEffect(() => {
    let cancelRequest = false;
    if (!url) return;

    const fetchData = async () => {
        dispatch({ type: 'FETCHING' });
        if (cache.current[url]) {
            const data = cache.current[url];
            dispatch({ type: 'FETCHED', payload: data });
        } else {
            try {
                const response = await fetch(url);
                const data = await response.json();
                cache.current[url] = data;
                if (cancelRequest) return;
                dispatch({ type: 'FETCHED', payload: data });
            } catch (error) {
                if (cancelRequest) return;
                dispatch({ type: 'FETCH_ERROR', payload: error.message });
            }
        }
    };
    fetchData();

    return function cleanup() { // call when component unmounted
        cancelRequest = true;
    };
}, [url]);
```


================================================

## Fetch API
### fetch data using Fetch API  
* a modern replacement for the legacy `XMLHttpRequest` API, no dependecy install required
* All modern browsers typically support the Fetch API nowadays

```js - GET
fetchUsers = this.fetchUsersWithFetchAPI;
const BASE_URL = 'https://www.example.com/api';

fetchUsersWithFetchAPI = () => {
    this.setState({...this.state, isFetching: true});

    fetch(`${BASE_URL}/users`)
        .then(response => response.json())
        .then(result => {
            this.setState({users: result, isFetching: false})
        })
        .catch(e => {
            console.log(e);
        })
        .finally(() => {
            this.setState({...this.state, isFetching: false})
        });
};

```

```js - POST
fetch(USER_SERVICE_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(user),
})
  .then((response) => response.json())
  .then((user) => {
    console.log('New user:', user);
  })
  .catch((e) => {
    console.error(e);
  });
```

```js - creating an interceptor for the fetch function
const fetch = fetchWithBase(window.fetch, BASE_URL);

fetch('/users');
fetch('/orders');

function fetchWithBase(fetch, baseURL) {
    return (url, ...params) => {
      if(url.startsWith('/')) 
        return fetch(baseURL + url, ...params)
      else 
        return fetch(url, ...params);
    }
}
```

### fetch data using Axios
* Axios saves the JSON parsing phase and handles all errors
* enables you to intercept HTTP requests and responses, protects the client side against cross-site request forgery (XSRF), and is capable of canceling requests

```js - fetch users
fetchUsers = this.fetchUsersWithAxios

async fetchUsersWithAxios() {
    try {
        this.setState({...this.state, isFetching: true});

        const response = await axios.get(USER_SERVICE_URL);
        this.setState({users: response.data, isFetching: false});
    } catch (e) {
        console.log(e);
        this.setState({...this.state, isFetching: false});
    } 
}
```

===============================================
# Concurrent Mode and React Suspense
* **Suspense** is a mechanism within **Concurrent Mode** that enables components to display a **`fallback`** while it _waits for some long-running operation (VD: `Data Fetching`) to finish_

* In other words, **React Suspense** is a set of features 
* -> help React apps stay responsive regardless of a **`user’s device capabilities or network speed`**
* -> enables wrapped component to **`communicate to React`** that they’re waiting for some data to load before rendering the component
* -> **`prevents components from rendering to the DOM`** until some asynchronous operation is completed
* => data fetching library like **`react-async`** nor a state management tool **`Redux`**







