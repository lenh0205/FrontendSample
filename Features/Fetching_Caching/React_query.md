
==================================================
# Overview
* **`use Fetch and useEffect()`** to manage API call in **`small scale applications`** is quite hard

* **TanStack Query** - a really important library if we need to do manually API requests
* -> _handle caching cache, validation, refetching behind the scene_

* **Các chức năng mạnh mẽ của React-query**
* -> **`Caching`**: a caching layer that allows to cache data in memory or in local storage
* -> **`Automatic Refetching`**: a built-in mechanism for automatic refetching of data based on configurable intervals, query state changes, or network status changes
* -> **`Query Invalidation`**:  invalidate specific query keys -> force refetching
* -> **`Query Retry`**: retry failed API requests based on _configurable criteria_ (network errors or status codes,...)
* -> **`Query Pagination`**: built-in support for query pagination
* -> **`Optimistic Updates`**: allowing to update the cache before the server has responded
* -> **`Query Devtools`**: inspect, debug queries and cache

======================================================
## Types of Status
* **status** - trạng thái của lần query đầu (_có data rồi ghi vào cache_)
* -> **`isLoading == true / status == "loading"`**: Query chưa có data
* -> **`isError == true / status == "error"`**: Query xảy ra lỗi
* -> **`isSuccess / status === "success"`**: Query thành công và data đã có sẵn

* **fetchStatus** - lần query sau dùng cache đã có; `refetching in the background`
* **`isFetching = true / fetchStatus === "fetching"`**: Đang fetching API
* **`isPaused = true / fetchStatus === "paused"`**: Query muốn fetch API nhưng bị tạm dừng vì 1 số lý do nào đó
* **`fetchStatus === "idle"`**: Query không làm gì cả, chạy xong rồi đang rảnh 

## Stale , stateTime, cacheTime
* normally,  **staleTime < cacheTime** 
* _default staleTime là 0 ms, default cacheTime là 5*60*1000 ms_

* khi 1 cache data vượt qua **`staleTime`** thì nó sẽ bị đánh dấu là **stale** (**`đã cũ`**)
* -> _khi data còn mới_, **react-query sẽ không refetching mà chỉ show cache**
* -> **`còn data đã stale`**, thì react-query sẽ show cache (`stale data`) đồng thời fetching data mới on the background 
* -> `reset cacheTime` 

* khi quá thời gian **`cacheTime`**, **cache sẽ bị xoá**
* -> không có cache để show, chỉ đơn giản là fetch lại API

=================================================
## Lưu ý:
* **reload trang thì sẽ clear cache; nhưng chỉ mount/unmounted component thì sẽ không clear cache**
* => vậy nên reload trang thì sẽ **`show loading statement`**; nhưng mount/unmount component thì không

* **even though react-query use the cache to display, it still make a request in background; then update data without visually obvious**
* -> _to remove this behavior_, use **`staleTime: Infinity`**

* react-query không quan trọng ta truyền gì cho **`queryFn`**, chỉ quan trọng **queryKey**
* -> Những components **`s/d chung data từ 1 queryKey`** sẽ cùng được cập nhật khi data associate with that queryKey đó được cập nhật
* -> Nếu tất cả component s/d data của 1 queryKey bị unmounted thì data queryKey sẽ là **inactive**

=================================================
# Caching API calls using React Query - TanStack Query

* **Sử dụng đối tượng "QueryClient" như là nơi chứa 1 config chung cho toàn bộ query trong App**
* -> không truyền param nếu muốn để cấu hình **`default`**
* -> có thể thêm config riêng cho từng query để ghi đè những option này

* _VD 1:_ `basic React-query`
```js - Provider
import { QueryClient, QueryClientProvider } from "@tanstack/react-query-devtools";
import { ReactQueryDevTools } from "@tanstack/react-query-devtools"

const queryClient = new QueryClient({
    defaultOptions: { // set somes default apply for every singe query
        queries: {
            cacheTime: 300000, // Lưu trữ dữ liệu trong cache trong 5 phút (tính bằng mili giây)
            staleTime: 60000, // Coi dữ liệu là cũ sau 1 phút (tính bằng mili giây)
            refetchOnWindowFocus: false, // Tắt tự động refetch khi cửa sổ được focus
            retry: 3, // Thử lại truy vấn lỗi tối đa 3 lần
        },
        mutations: {
            throwOnError: true, // Throw error nếu mutation gặp lỗi
        },
    }
});
// pass to Provider:
// -> so that we can use "queryClient" anywhere in app through this context
// -> allow to have access to all of the hooks that react-query provides

function App() {
    const [showDemo, setShowDemo] = useState(true);
    return (
        <QueryClientProvider client={queryClient}>
            <button onClick={() => setShowDemo(!showDemo)}>Toggle Demo</button>
            {showDemo && <Demo>}
            <ReactQueryDevTools/> {/* a dev tool for development enviroment */}
        </QueryClientProvider>
    )
}
```

* **s/d "React-query hook" để call API**
* -> **`useQuery()`** để tải và quản lý dữ liệu từ server 
* -> **`useMutation()`** thực hiện thay đổi dữ liệu và API request tác động đến dữ liệu
```js - Consumer
import { useQuery, useMutation } from "@tanstack/react-query";

// use "useQuery()" hook whenever we want create a query with react-query
export default function Demo() {
    const [title, setTitle] = useState("");
    const [search, setSearch] = useState(""); // for searching by query param
    const queryClient = useQueryClient(); // get the "queryClient" we pass to "QueryClientProvider"

    const { data: todos, isLoading, status, error } = useQuery({
        queryFn: fetchTodos(search), // any function that return a Promise

        queryKey: ["todos", { search }]  
        // as an identification for the query to create a cache
        // make sure every param that pass to fetch function will show up in queryKey
        // => so that it will create cache for every single query that have different param

        staleTime: Infinity 
        // -> never consider its data as a stale - the data still valid
        // => react-query won't refetch data in the background

        cacheTime: 0
        // should never cache the data and always make a fetch request

        // ....Ngoài ra, còn có refetchInterval, refetchOnMount,...
    })
    // data -> hold actual data that being return by fetch function (undefined at intial)
    // isLoading -> indicate that query is loading

    // mutation: add todo
    const { mutateAsync: addTodoMutation } = useMutation({
        mutationFn: addTodo,
        onSucess: () => { // run when "mutation" sucess
            queryClient.invalidateQueries(["todos"]);
            // -> invalidate query by queryKey to make a refetching
            // -> invalidate every query that has partial match is "todos" queryKey
            // regardless of what else parameters they have in their queryKey
        }
    });
    // "mutate" và "mutateAsync" giống hệt nhau chỉ khác 1 cái là async
    // after mutation we need to fetch new data

    // Ngoài ra, có thể sử dụng "stale-while-revalidate" để cải thiện hiệu suất

    if (isLoading) return <div>Loading...</div> // hoặc:
    if (status = "loading") return <h1>Loading...</h1>
    if (status = "error") return <h1>{JSON.stringify(error)}</h1>
    
    return (
        <div>
            <div>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTile(e.target.value)}
                />
                <button onClick={async () => {
                    try {
                        await addTodoMutation({ title })
                        setTitle("")
                    } catch (e) {
                        console.error(e);
                    }
                }}>Add Todo</button>
            </div>
            {todos.map((todo) => {
                return <TodoCard key={todos.id} todo={todos}/>
            })}
        </div>
    )
}
```

```js - fetch mock API
const todos = [
    { id: 1, title: "Learn HTML", completed: false },
    { id: 2, title: "Learn CSS", completed: false }
]

// Read:
export const fetchTodos = async (query = ""): Promise<ToDo[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const filteredTodos = todos.filter(
        (todo) => todo.title.toLowerCase().includes(query).toLowerCase());
    return [...filteredTodos];
};

// Write:
export const addTodo = async (todo: Pick<Todo, "title">) : Promise<ToDo> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newTodo = {   
        id: todos.length + 1,
        title: todo.title,
        completed: false
    }
    todos.push(newTodo);

    return newTodo;
}
```

* _VD 2:_ `query a specific "post" by Id, than use "userId" property of that object to get a user`
* -> thường để làm vậy với Fetch và useEffect sẽ rất phức tạp 
``` js
import { useParams } from "react-router-dom";

export function PostDetail () {
    const { id } = useParams();

    const { status: statusPost, error: errorPost, data: post } = useQuery({
        queryKey: ["posts", parseInt(id!)],
        queryFn: () => getPost(id!)
    });
    const { status: statusUser, data: user } = useQuery({
        enabled: post?.userId != null, // don't run this query until it return "true"
        queryKey: ["users", post?.userId],
        queryFn: () => getUser(post!.userId)
    });

    if (statusPost === "loading") return <h1>Loading...</h1>
    if (statusPost === "error") return <h1>{JSON.stringify(errorPost)}</h1>

    let userName = user?.name
    if (statusUser === "loading") userName = "Loading...";
    if (statusUser === "error") userName = "Error";

    return (
        <div>
            <h1>{post.title}</h1>
            <h2>{username}</h2>
        </div>
    )
}
```

* _VD 3:_ `mutation - create new post and cache data for Detail page`
```js 
export const CreatePost = () => {
    const navigate = useNavigate();
    const titleRef = useRef<HTMLInputElement>(null);
    const bodyRef = useRef<HTMLInputElement>(null);

    const queryClient = useQueryClient();
    const { status, error, mutate } = useMutation({
        mutationFn: createPost,
        onSuccess: newPost => {
            queryClient.setQueryData(["posts", newPost.id], newPost); // set data to actual client
            // -> after successfully create a post, and have all data of that "post" return back
            // -> instead of going to the "PostDetail" page then refetching that "post" data
            // -> tell react-query to cache that "post" data using ["posts", newPost.id] queryKey
            // -> it the same queryKey that "PostDetail" page use to fetch a specific post

            navigate(`/posts/${newPost.id}`); // redirect to "PostDetail" page and pass an Id
        }
    })

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        mutate({ // it's "createPost" function
            title: titleRef.current!.value,
            body: bodyRef.current!.value
        })
    }
}
```

* _VD 4:_ `pagination`
```js
import { Link, useSearchParams } from "react-router-dom";

export function PaginatedPosts() { // "/paginated" route
    const [params] = useSearchParams();
    const page = parseInt(params.get("page")!) || 1;

    // "fetchStatus" for a refetching; "status" for first loading
    const { status, error, data, fetchStatus } = useQuery({
        queryKey: ["posts", { page }],
        queryFn: () => getPostsPaginated(page),
        keepPreviousData: true
        // -> make sure old data stays on the screen until the new data is loaded
        // -> tức là chuyển sang trang khác nó không làm trang trắng trơn 
    })

    if (status === "loading") return <h1>Loading...</h1>;
    if (status === "error") return <h1>{JSON.stringify(error)}</h1>

    return ( 
        <>
            <h1>Posts {fetchStatus === "fetching" && "Loading..."}</h1>
            <PostList posts={data.posts}/>

            {data.previousPage && (
                <Link to={`/paginated?page=${data.previousPage}`}>Previous</Link>
            )}
            {data.nextPage && (
                <Link to={`/paginated?page=${data.nextPage}`}>Next</Link>
            )}
        </Link>
    )
}

function getPostsPaginated(page: number) {
    return axios
        .get<Post[]>("http://localhost:3000/posts", {
            params: { _page: page, _sort: "title" }
        })
        .then(res => {
            const hasNext = page * 10 <= parseInt(res.headers["x-total-count"] as String) - 10;
            return {
                nextPage: hasNext ? page + 1 : undefined,
                previousPage: page > 1 ? page - 1 : undefined,
                posts: res.data
            }
        })
}
```

* _VD 5:_ `Infinity Scrolling` 
```js
import { useInfiniteQuery } from "@tanstack/react-query";

export function InfinitePosts() {
    const { stats, error, data, isFetchingNextPage, hasNextPage } 
        = useInfiniteQuery<{
            nextPage: number | undefined
            previousPage: number | undefined
            posts: Post[]
        }>({
            queryKey: ["posts", "infinite"],
            queryFn: ({ pageParam = 0 }) => getPostsPaginated(pageParam),
            getNextPageParam: prevData => prevData.nextPage
        })

    if (status === "loading") return <h1>Loading...</h1>;
    if (status === "error") return <h1>{JSON.stringify(error)}</h1>;

    return (
        <>
            <h1>Posts </h1>
            <PostList posts={data.pages.map(data => data.posts).flat()} />
            {hasNextPage && (
                <button onClick={() => fetchNextPage()}>
                    {isFetchingNextPage ? "Loading..." : "Load More"}
                </button>
            )}
        </>
    )
}
```