* for catching error inside component without being part of component because we will wrap it outside of component
* ErrorBoundary cần là 1 class; để ta có thể s/d method **getDerivedStateFromError**
* -> anytimes ErrorBoundary component or it child components throw an error
* -> thay vì trang của ta bị đứng trắng bóc, nó sẽ gọi **`getDerivedStateFromError`**
* -> this method allow us to **`update the state`** as the name implies based on the error that happened

* another method that automatically gets called when component throw an error is **componentDidCatch**
* -> nhưng khác chỗ là nó không `update the state as the name implies` mà nó running specific code
* -> most use cases is sending off a log to server; or making some log in database
* -> đối số thứ 2 của method cho ta 1 **`Object`** contains the entire stack trace for **where the error came from** (_what component cause this error_)

```js
interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = { hasError: false }; // khởi tạo trong constructor thì "state" là "readonly"
  }

  // First Method: allow to render out fallback data
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    // trong trường hợp này ta sẽ ko s/d "error" mà chỉ thông báo rằng ta đang có error hay không
    return { hasError: true };
  }

  // Second Method: for loggin and reporting system
  componentDidCatch(error, info) {
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    logErrorToMyService(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback;
    }

    return this.props.children;
  }
}
```

* 1 good use case for an ErrorBoundary is wrap entire application 
```js
<ErrorBoudary fallback={<p>Something went wrong</p>}>
    <App/>
</ErrorBoudary>
```

* Lưu ý: ErrorBoudary chỉ hiện thị fallback tốt trên production, lúc dev có thể lúc được lúc không