# Decorator
* -> giúp ta **`thay đổi hành vi của các Hàm/Phương thức`** mà **`không tác động vào source code của chúng`** (_1 hàm để trang trí thôi chứ không thay đổi hàm gốc_)

* -> những kỹ thuật như **Debouncing**, **throttle**, **Higher-Order Component** in React là những ví dụ về _function decorator_ 
* -> the **`parameters of decoratee`** (a function as argument) and the **`decoratee`** itself are **`decoupled`** by using the **currying technique**

* Với những hàm cùng input cho ra cùng output; ta có thể s/d kỹ thuật decorator (_nhận vào một hàm và trả về một hàm_)
* -> tách biệt được logic của hàm và các xử lý ngoài lề
* -> nhờ thế ta có thể áp dụng nó cho bất cứ hàm nào 
* -> ta có thể s/d nhiều decorator cho một hàm

* VD: nếu 1 hàm tính toán rất tốn thời gian và bộ nhớ; ta có thể tìm cách cache giá trị của hàm - tránh trường hợp phải tính đi tính lại những kết quả giống nhau
```js
function calc(x) {
	// Xử lý ở đây có thể rất tốn thời gian và bộ nhớ
	console.log(`Calc with ${x}`);
	return x;
}

function cachingDecorator(func) {
	const cache = new Map();

	return function(x) {
		if (cache.has(x)) {
			return cache.get(x);
		}
		
		const result = func(x);
		cache.set(x, result);
	
		return result;
	};
}

calc = cachingDecorator(calc);
console.log(calc(1)) // Calc with 1 // 1
console.log(calc(1)) // 1
```

============================================================
# Sử dụng decorator với method của object
* Vấn đề: khi Method của object tham chiếu đến this

```js
// Việc đưa method làm function đầu vào decorator làm context thay đổi
// this chuyển từ "worker" thành "window"
const worker = {
	multiplier: 1,
	calc: function(x) {
		console.log(`Calc with ${x}`);
		return x * this.multiplier;
	}
}

function cachingDecorator(func) {
	const cache = new Map();

	return function(x) {
		if (cache.has(x)) {
			return cache.get(x);
		}
		const result = func(x);
		cache.set(x, result);
	
		return result;
	};
}

worker.calc(1) // Calc with 1 // 1
worker.calc = cachingDecorator(worker.calc);
worker.calc(1) // Calc with 1 // NaN
```

## Solution 1: Function.prototype.bind
* -> **`sticky "context" to method`**
* -> _however_, this solution is quite **`verbose`**; additional, mỗi lần gọi bind sẽ sinh ra 1 hàm mới có thể gây **`tốn bộ nhớ`** (tức là khi mỗi lần ta sử dụng decorator với 1 method khác nhau thì ta phải gọi bind() 1 lần)
* => ta có thể dùng **call()**

```js
worker.calc = cachingDecorator(worker.calc.bind(worker));
worker.calc(1); // Calc with 1 // 1
worker.calc(1); // 1
```

```js - VD về "bind()"
const foo = {
	x: 1,
	getX: function() {
		return this.x;
	}
}

const func = foo.getX;
func(); // undefined

const boundFunc = foo.getX.bind(foo);
boundFunc(); // 1
```

## Solution 2: Function.prototype.call
* **`cho phép gọi 1 hàm với context của nó`**
* -> _tức là ta có thể gọi 1 hàm như bình thường, đồng thời truyền ngữ cảnh 1 cách tường mình như là đối số đầu tiên_
* -> đối số này bình thường không có nhiều ý nghĩa, _trừ khi hàm của ta **`tham chiếu đến this`**_
* -> However, chúng ta **`cần biết chính xác số lượng tham số của hàm cần decorate`**; 
* => ta sẽ cần viết những decorator mang tính khái quát hơn

```js
const worker = {
	multiplier: 1,
	calc: function(x) {
		console.log(`Calc with ${x}`);
		return x * this.multiplier;
	}
}

function cachingDecorator(func) {
	const cache = new Map();

	return function(x) {
		if (cache.has(x)) {
			return cache.get(x);
		}
		const result = func.call(this, x);
		cache.set(x, result);
	
		return result;
	};
}
worker.calc = cachingDecorator(worker.calc);
worker.calc(1);// Calc with 1 // 1
worker.calc(1); // 1
```

```js
function fullName() {
	return `${this.firstName} ${this.lastName}`;
}

const user1 = {firstName: 'foo', lastName: 'bar'};
const user2 = {firstName: 'Foo', lastName: 'Bar'};

fullName.call(user1); // foo bar
fullName.call(user2); // Foo Bar
```

=======================================================
# Xây dựng decorator tổng quát
* _làm sao để decorator support cả các hàm có 2 tham số và hàm có 1 tham số ?_

## cachingDecorator
* **vấn đề 1**: làm sao để **`sử dụng nhiều giá trị để làm key`** cho đối tượng cache
* -> **solution 1**: (đơn giản nhất) s/d string của các giá trị làm key của Map (**Array.join()**)
* -> **solution 2**: s/d thư viện để xử lý các tham số, **`cho ra một giá trị duy nhất với các đầu vào khác nhau`**
* -> **solution 3**: **`sử dụng Map lồng nhau`**, ví dụ: có 2 tham số max, min; cache.set(min) sẽ lưu một Map vào giá trị của nó, lúc này chúng ta cần gọi kết quả bằng cách cache.get(min).get(max)

* **vấn đề 2**: phải tìm **`cách truyền tham số cho hàm trong decorator`** (_tức là decorator nhận nhiều tham số hơn mà vẫn support hàm có 1 tham _)_
* -> **solution 1**: s/d **Function.prototype.apply(this, array)** rồi **`truyền 1 Array (hoặc giống Array) chứa tất cả đối số`** như 1 đối số duy nhất
* -> **solution 2**: ta cũng có thể s/d **call()** và rồi **`truyền đối số bằng cách spead Array`** chứa tất cả đối số

```js
// Bây giờ decorator cachingDecorator có thể tương thích với bất kỳ Hàm/Phương thức nào

function cachingDecorator(func, hash) {
	let cache = new Map();
  
	return function(...args) {
		let key = hash(args);
		if (cache.has(key)) {
			return cache.get(key);
		}

	    let result = func.apply(this, args);
		cache.set(key, result);
		
		return result;
 	};
}
function hash(...args) { // caculate key for
	return args.join();
}

const worker = {
	calc(min, max) {
		console.log(`Calc with ${min}, ${max}`);
		return min + max;
	}
}
worker.calc = cachingDecorator(worker.calc, hash);
worker.calc(1, 2); // Calc with 1, 2 // 3
worker.calc(1, 2); // 3


function calc(x) {
    console.log(`Calc with ${x}`);
    return x;
}
calc = cachingDecator(calc, hash);
calc(1); // Calc with 1 // 1
worker.calc(1);  // 1
```

========================================================
# Decorator with Typescript
* -> the decorator should be **`a generic function`** in order to have **`any function to be possibly decorated`**
* -> while calling the decorator, the **`type of the decoratee`** is passed around, following **`decorator<decorateeType>(decoratee)`**
* -> the **Parameters<T>** of Typescript returns the **`type of a function’s arguments`** in form of **`a tuple`**

```js
const memoize = <F extends (...args: any) => any> (
		f: (...args: Parameters<F>) => ReturnType<F>
	) => {
    const cache : Record<string, ReturnType<F>>= {};
    return (...args: Parameters<F>) => {
      const argString = JSON.stringify(args);
      cache[argString] = cache[argString] || f(...args);
      return cache[argString];
  };
};
const getAverage = (grades: number[]) => {
	return grades.length ? grades.reduce((acc, grade) => grade + acc, 0) / grades.length : 0;
} 

const getAverageMemoized = memoize<typeof getAverage>(getAverage);

const grades = [4, 6];
const avg0 = getAverageMemoized(grades); // 5
const avg1 = getAverageMemoized(grades); // 5, hit the cache
```

=======================================================
# Recursive decorator
* when  **`a decorator`** takes **`a decorator`** as **`argument`**, this is a case of **`recursion`**

* this is the way **`Redux`** support **implements the support of middlewares**
* -> **a middleware** is **`a layer providing a service`**
* -> **a layer** is **`a function decorating the next layer`** and so on **`recursively`**
* -> in Redux, the **decoratee** is the reducer — to be precise, **`a wrapper around the reducer`**
* -> **`the argument of each layer`** is the **action**

* one of the roles of a **`middleware`** is to **modify the action**
* -> in the framework supporting middleware like Express.js, **`a middleware extends the "request" object`**
* -> in the example below, **`the action is first passed with a value`** (_{type: "todo/add", payload: "Buy food"}_) and is **`changed in each layer`**
* -> **a layer** can also **`interrupt the handover to the next layer`** by not calling **next** under certain circumstances
* => to make an analogy with Redux, this means that the reducer will not be called, therefore the state will not be changed


```js - the basic illustration
// "chain" function automates the creation of the final decorator
// the "x => x" is the "decoratee" 
// it's decorate by "log3"; then "log2"; then "log1" 

const chain = (...funcs) => {
  if (funcs.length === 0) {
    return (x) => x;
  }
  if (funcs.length === 1) {
    return funcs[0];
  }
  return funcs.reduce((a, b) => (...args) => a(b(...args)));
};

const log1 = (next) => (a) => {
  console.log("log1 before");
  next({...a, log: 1});
  console.log("log1 after");
};
const log2 = (next) => (a) => {
  console.log("log2 before");
  next({...a, log: 2});
  console.log("log2 after");
};
const log3 = (next) => (a) => {
  console.log("log3 before");
  next({...a, log: 3});
  console.log("log3 after");
};

chain(log1,log2,log3)(x => x)({ type: "todo/add", payload: "Buy food" });

/*
log1 before
log2 before
log3 before
log3 after
log2 after
log1 after
*/
```
