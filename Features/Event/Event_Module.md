
# "events" module - Event Emitter
* -> allow us to **`work with events`** in Node.js
* -> **an event** - is **`an action or an occurence`** that has happened in our application that **`we can respond to`**

* => _using the events module_, we can **`dispatch our own custom events`** and **`respond to those custom events`** in **a non-blocking manner**

## EventEmitter
* -> **`the events module`** **returns a class** called **`EventEmitter`** 
* -> which encapsulates functionality to **emit events** and **respond to event**

```r - a non-technical day-to-day scenario of "event"
// we are hungry and head out to Domino to have a pizza
// at the counter, we place our order for a pizza
// the line cook sees the order on the screen and bakes the pizza for us

// -> in this scenarios, order being placed is the "event"
// -> baking pizza is the "response" to that event
```

* _basic `emmitter` and `listener`_
```js
const EventEmitter = require("node:events");

// instantiate the class 
const emitter = new EventEmitter();

// register a "listener" to reponse to event:
// -> arg1 is "event name"
// -> ar2 is listener - a callback get executed when the corresponding event is emitted
emitter.on("order-pizza", () => {
    console.log("Order received! Baking a pizza")
})

// emit an event:
// -> when execution reach this line, an event is broadcasted in our code:
emitter.emit("order-pizza")

// now run "node index.js", the output iss "Order received! Baking a pizza"
```

* _sometimes when emitting an event, we may want to **`pass data to the listener`**_
* _ **`register multiple listeners`** for the same event_
```js - 
// -> for example, when order a pizza we want to specify the "size" and "topping"
// -> just specify the arguments after the event name while emitting the event

emitter.on("order-pizza", (size, topping) => {
    console.log(`Order received! Baking a ${size} pizza with ${topping}`)
})
emitter.on("order-pizza", (size) => {
    if (size === "large") {
        console.log("Serving complimentary drink");
    }
})

console.log("Do work before event occurs in the system");

emitter.emit("order-pizza", "large", "mushrooms");

// Output: 
// Do work before event occurs in the system
// Order received! Baking a large pizza with mushrooms
// Serving complimentary drink
```

# Event-Driven programming
* the code **`execution doesn't stop`** at **`emitter.on()`** - waiting for event to occur
* -> all we do is **`delay the execution of a function`** till **`a certain event is signaled in the system`**
* => this is known as **Event-Driven programming**, which is used a lot in Nodejs

===============================================
> create our own module that builds on top of the EventEmitter class

# Extending from EventEmitter
* a module can **`extend from EventEmitter`** allowing them to **"emit" and "react" to their own custom events**
* => most of built-in module, especially **fs, stream, http** also **`extend`** from the **`EventEmitter class`**

```js
// -> we would like the shop to be able to handle orders using the "event-driven architecture", that is using "events" module

// pizza-shop.js
const EventEmitter = require("node:events");

// use "PizzaShop" class as if "EventEmitter" class
class PizzaShop extends EventEmitter = {
    constructor() {
        super();
        this.orderNumber = 0
    }

    order() { // to place an order
        this.orderNumber++;
        this.emit("order", size, topping);
    }

    displayOrderNumber() { // to view the current order number
        console.log(`Current order number: ${this.orderNumber}`);
    }
}
module.exports = PizzaShop;

// index.js
const PizzaShop = require("./pizza-shop");
const pizzaShop = new PizzaShop();

pizzaShop.on("order", (size, topping) => {
    console.log(`Order received! Baking a ${size} pizza with ${topping}`)
})

pizzaShop.order("large", "mushrooms");
pizzaShop.displayOrderNumber();

// Output:
// Order received! Baking a large pizza with mushrooms
// Current order number: 1
```

* _by using events_, we are able to **`tie together different modules`** without having to tightly couple them
```js - listener to serving a drink
// drink-machine.js
class DrinkMachine {
    serveDrink(size) {
        if (size === "large") {
            console.log("Serving complimentary drink");
        }
    }
}
module.exports = DrinkMachine;

// index.js
const DrinkMachine = require("./drink-machine");
const drinkMachine = new DrinkMachine();

pizzaShop.on("order", (size, topping) => {
    console.log(`Order received! Baking a ${size} pizza with ${topping}`);
    drinkMachine.serveDrink(size);
})

// Output:
// Order received! Baking a large pizza with mushrooms
// Serving complimentary drink
// Current order number: 1
```