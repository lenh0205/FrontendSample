# Idea:
* In traditional data fetching approaches, the client has to **`make multiple requests`** to the server for different data
* -> leading to **`slow page loading times`**, 
* -> **`network congestion`**
* -> **`increased server load`**

* **Mechanism**: **`tải dữ liệu, lưu trữ cache, quản lý State (CRUD) dựa trên cache, tự động cập nhật lại khi dữ liệu thay đổi`**
* -> Khi dữ liệu được yêu cầu lại, React-Query sẽ trả về dữ liệu từ cache mà không cần gửi yêu cầu mạng mới
* -> giảm số lượng yêu cầu mạng và tăng hiệu suất ứng dụng

=================================================
# Place to store cache
* **HDD** (VD: **`localStorage`**)
* **RAM** = application state (VD: **`redux store`**)

==================================================
# Cache
* In computing, **a cache** is a **`temporary storage location`** that stores frequently accessed data or instructions
* -> to expedite future requests for that data
* -> improve system performance by reducing the time and resources required to retrieve data from the original source

# Implementation of cache in react 
* **`store a cache with a key`** to efficiently accessing the particular data 
* the cache should be **`available to all components`** -> use `context`

```js
// put cache provider on the top-level of app
<CacheProvider>
    <App />
</CacheProvider>

// create context file for using cache
import { createContext, useContext, ReactNode } from "react";

type ContextType = {
  getCache: (key: string) => any;
  setCache: (key: string, value: any, ttl?: number) => void;
  clearCache: () => void;
  deleteCache: (key: string) => void;
};
type cacheBody = {
  expiry: Date;
  data: any;
};

const CacheContext = createContext<ContextType | null>(null);

export function useCache() {
  return useContext(CacheContext) as ContextType;
}

export default function CacheProvider({ children }: { children: ReactNode }) {
  const map = new Map<string, cacheBody>();

  function getCache(key: string) {
    const cacheValue = map.get(key);
    if (!cacheValue) return undefined;
    if (new Date().getTime() > cacheValue.expiry.getTime()) {
      map.delete(key);
      return undefined;
    }
    return cacheValue.data;
  }
  function setCache(key: string, value: any, ttl: number = 10) { // Time to Live
    var t = new Date();
    t.setSeconds(t.getSeconds() + ttl);
    map.set(key, {
      expiry: t,
      data: value
    });
  }
  function clearCache() {
    map.clear();
  }
  function deleteCache(key: string) {
    map.delete(key);
  }

  const contextValue = {
    getCache,
    setCache,
    clearCache,
    deleteCache
  };

  return (
    <CacheContext.Provider value={contextValue}>
      {children}
    </CacheContext.Provider>
  );
}
```

* Đóng gói logic **check if cache present** and **making request** thành 1 **custom Hook**:
* -> provides _state management_: **`loading, error, data`** in component
* -> also provides you methods to **`refetch and invalidate a query`**
```js
import { useEffect, useState } from "react";
import { useCache } from "../contexts/Cache";
import axios, { AxiosRequestConfig, AxiosError } from "axios";

type CacheEnable =
  | {
      enabled: true;
      ttl?: number;
      suspense?: number;
    }
  | {
      enabled: false;
    };

type CustomAxiosConfig<T = any> = AxiosRequestConfig & {
  key: Array<unknown>;
  initialEnabled?: boolean;
  cache?: CacheEnable;
  onSuccess?: (data: T) => void;
  onFailure?: (err: AxiosError) => void;
};

function keyify(key: CustomAxiosConfig["key"]) {
  return key.map((item) => JSON.stringify(item)).join("-");
}

export default function useFetch<T = any>({
  key,
  initialEnabled = true,
  cache,
  ...axiosConfig
}: CustomAxiosConfig<T>) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T | undefined>();
  const [error, setError] = useState<any>();
  const { getCache, setCache, deleteCache } = useCache();

  const refetch = (hard: boolean = false) => {
    setLoading(true);
    setError(undefined);
    const cacheKey = keyify(key);

    if (cache?.enabled && getCache(cacheKey) !== undefined && !hard) {
      const val = getCache(cacheKey);
      setData(val);
      setLoading(false);
      setError(undefined);
    } 
    else {
      axios(axiosConfig)
        .then(({ data }) => {
          setData(data as T);
          if (cache?.enabled) setCache(cacheKey, data, cache.ttl ?? 20);
        })
        .catch((err: AxiosError) => {
          setError(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  function inValidate(invalidationKey: CustomAxiosConfig["key"]) {
    deleteCache(keyify(invalidationKey));
  }

  useEffect(() => {
    if (initialEnabled) refetch();
    // eslint-disable-next-line
  }, []);

  return { loading, data, error, refetch, inValidate } as const;
}

```

* **`Usage`**:
```js
type APIUserResponse = {
  results: User[];
};

export default function App() {
  const { loading, error, data, refetch } = useFetch<APIUserResponse>({
    url: "https://randomuser.me/api",
    method: "get",
    key: ["app", "get", "user", { name: "nisab" }],
    cache: {
      enabled: true,
      ttl: 10
    }
  });

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Something went wrong</p>;
  }

  return (
    <div className="App">
      {JSON.stringify(data?.results[0])}
      <button onClick={() => refetch()}>Get user</button>
    </div>
  );
}
```
