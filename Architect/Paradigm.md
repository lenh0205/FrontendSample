
* Programming paradigm is all about **`how common programming problems should be tackled`**
-> **Imperative Programming** - viết 1 tập các **`instruction`** cụ thể cho máy tính thức hiện
```js
//  To bake a cake:
1- Pour flour in a bowl
2- Pour a couple eggs in the same bowl
3- Pour some milk in the same bowl
5- Pour the bowl in a mold
6- Cook for 35 minutes
```
* -> **Procedural Programming** - thêm vào tính năng **`function`** để abstract và tổ chức lại code, instruction 
```js
function pourIngredients() {
    // instruction
}
function mixAndTransferToMold() {
    // instruction
}
function cookAndLetChill() {
    // instruction
}

// Đây là những gì cần biết về program này:
pourIngredients()
mixAndTransferToMold()
cookAndLetChill()
```
* -> **Functional Programming** - dùng function để làm mọi thứ - `assigned to variables, passed as arguments, returned from other functions, ...`
* -> **Declarative Programming** - viết sẵn những **`method`** chứa logic thường dùng, ta chỉ cần gọi nó là được
```js
const filterNum = nums.filter(num => num > 5);
```
* -> **Object-Oriented Programming** - separate concerns into **`entities`**

# Object-Oriented Programming
```js - VD: 1 game có 100 characters
const alien1 = {
    name: "Ali",
    species: "alien",
    phrase: () => console.log("I'm Ali the alien!"),
    fly: () => console.log("Zzzzzziiiiiinnnnnggggg!!")
}
const bug1 = {
    name: "Buggy",
    species: "bug",
    sayPhrase: () => console.log("Your debugger doesn't work with me!"),
    hide: () => console.log("You can't catch me now!")
}
// ....1 2 đối tượng thì không sao, nhưng 100 thì
```

# Why need "class" ?
* -> _Problem_: việc **`manually set the properties and methods`** for each of object is **not scale well and error prone**
* -> _Solution_: định nghĩa đối tượng bằng **`class`**

```js
class Alien { 
    constructor (name, phrase) {
        this.name = name
        this.phrase = phrase
        this.species = "alien"
    }
    fly = () => console.log("Zzzzzziiiiiinnnnnggggg!!")
    sayPhrase = () => console.log(this.phrase)
}
class Bug {
    constructor (name, phrase) {
        this.name = name
        this.phrase = phrase
        this.species = "bug"
    }
    hide = () => console.log("You can't catch me now!")
    sayPhrase = () => console.log(this.phrase)
}

const alien1 = new Alien("Ali", "I'm Ali the alien!")
const alien2 = new Alien("Lien", "Run for your lives!")
const bug1 = new Bug("Buggy", "Your debugger doesn't work with me!")
const bug2 = new Bug("Erik", "I drink decaf!")
```

# Why need "Inheritance" ?
* -> _Problem_: ta cần **`thêm 1 số thuộc tính, method chung cho tất cả class`**
* -> _Solution_: thay vì thêm thuộc tính, method đó vào từng class ta sẽ **`định nghĩa 1 base class cho những class khác kế thừa`**

* Mỗi class chỉ có thể kết thừa 1 class khác, vậy nên ta sẽ cần 1 **Inheritance chain**
* **can't decide what methods and properties to inherit from a parent class**, must inherit all

```js
// Base class "Character"
class Character {
    constructor (speed) {
        this.speed = speed
    }
    move = () => console.log(`I'm moving at the speed of ${this.speed}!`)
}

// Base class "Enemy"
class Enemy {
    constructor(power) {
        this.power = power
    }
    attack = () => console.log(`I'm attacking with a power of ${this.power}!`)
}

class Alien extends Enemy {
    constructor (name, phrase, power) {
        super(power)
        this.name = name
        this.phrase = phrase
        this.species = "alien"
    }
    fly = () => console.log("Zzzzzziiiiiinnnnnggggg!!")
    sayPhrase = () => console.log(this.phrase)
}
//....

const alien1 = new Alien("Ali", "I'm Ali the alien!", 10);
alien1.attack() // output: I'm attacking with a power of 10!
```

# Why need "Encapsulation" ?
* đảm bảo 1 thông tin chỉ được sử dụng bên trong class 
* use **`#`** for private

```js
class User{
    #name // private property

    constructor(name, password){
        this.#name = name
        this._password = password
    }
    
    #printName(){ // private method
        console.log(this.#name);
    }
    PrintFromPrivateMethod(){
        this.#printName()
    }
}
```

# Why need "Abstraction" ?
* only expose to the outside the properties and methods 

# Why need "polymorphism"
* **`Method Overloaded`** - giúp tạo ra multiple form without create bad practise when using multiple flag 
* **`Method Overrided`** - cho phép tạo ra biến thể riêng cho class
```js - Method overrided
class Enemy extends Character {
    constructor(name, phrase, power, speed) {
        super(speed)
        this.name = name
        this.phrase = phrase
        this.power = power
    }
    sayPhrase = () => console.log(this.phrase)
    attack = () => console.log(`I'm attacking with a power of ${this.power}!`)
}
class Alien extends Enemy {
    constructor (name, phrase, power, speed) {
        super(name, phrase, power, speed)
        this.species = "alien"
    }
    fly = () => console.log("Zzzzzziiiiiinnnnnggggg!!")
    attack = () => console.log("Now I'm doing a different thing, HA!") 
}
```

# Prototype Inheritance
* Prototypes **`contain all methods`**
* these methods are **`accessible to all objects`** linked to this prototype

* _3 way to implement Prototypal Inheritance:_
## Constructor Functions 
* -> a constructor **`gets called when an object is created using the "new" keyword`**
* -> never create a function **`inside of a constructor function`** (_performance issue_)

```js
function User(name){
    this.name = name;
}
User.prototype.printName = function(){
	console.log(this.name)
}
// all object created by "User" constructor will have access to "printName"

User.prototype.species = "Homo Sapiens";

let kedar = new User("kedar")
console.log(kedar.__proto__ === User.prototype) // True
console.log(User.prototype.isPrototypeOf(kedar)) // True

console.log(User.hasOwnProperty("species")) // False
console.log(User.prototype.hasOwnProperty("species")) // True   

// For Array:
Array.prototype.unique = function(){
    return [...new Set(this)]
}
const arr = [1,2,4,4,5,5]
console.log(arr.unique());
```

## Inheritant by Function constructor and Object.create()

* _step 1_: **attach "this" to base constructor** and call it 
* -> able to **`access the properties of base constructor`**
* -> but **`not method`**

* _step 2_: **right after derived constructor, immediately pointed the base prototype to the derived prototype**
* -> using **`Object.create()`**
* -> able to **`access to the methods`** of the base constructor

* _step 3_: **always create methods of the derived function after** _pointing the derived prototype to the base prototype_
* -> because the pointing will **`returns an empty object`** and **`removes all methods on the derived function`**

```js 
// Base:
const User = function(name, password){
    
    this.name = name
    this.password = password
}
User.prototype.printName = function(){
    console.log(this.name);
}

// Derived:
const Admin = function(name, password, course){
    User.call(this, name, password) // attach "this" to User and call it
    this.course = course
}

Admin.prototype = Object.create(User.prototype)

Admin.prototype.Stats = function(){
    console.log("Stats");
}

const kedar = new Admin("kedar", 12345, "JavaScript")
kedar.printName()
```

## Inheritant by ES6 Classes 
* an alternative for implementing prototypal inheritance
* **`ES6 class uses constructor functions to implement inheritance behind the scenes`**

```js
class User{
    constructor(name, password){
        this.name = name
        this.password  =password
    }
    printName(){
        console.log(this.name);
    }
}

class Admin extends User{
    constructor(name, password, course){
        super(name, password)
        this.course = course
    }
    Stats(){
        console.log("Stats");
    }
    
    // Method Override:
    printName(){
    	console.log("Child class " + this.name)
    }
}
```

# Encapsulation