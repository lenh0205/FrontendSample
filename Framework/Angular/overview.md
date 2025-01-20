# Overview
* -> a **`Typescript-based framework for building UI`** developed at **Google** as the sequel to **AngularJS**

* -> generate our initial application comes with pre-configured **`routing`**, **`testing`** framework, our favourite **`style preprocessor`**

```bash - create new Angular project
ng new my-app
```

```bash - turn our app into a PWA (progressive web app)
ng add @angular/pwa
```

```bash - support server-side rendering
ng add @nguniversal/express-engine
```

```bash - fire support
ng add @angular/fire
```

# create components with CLI
```bash
ng generate component navbar
# -> nó sẽ tạo ra 1 thư mục "navbar" trong "src/app" bao gồm các file:
# -> navbar.component.html
# -> navbar.component.spec.ts
# -> navbar.component.ts
# -> navbar.component.scss
``` 

* -> **`@Component`** decorator - make this typescript class a **component**
* -> the most important feature is allowing **bind data from this typescript file to the HTML template** 
* -> any properties on this class are considered reactive **state** - when their value changes **`the component will re-render the UI`**
* -> bind property to HTML using **`{{ property }}`**
* -> add event by **`(event)="expression"`**

```js - navbar.component.ts
@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
}
```

```js - update
@Component({
  selector: 'app-navbar',
  templateUrl: `
    <p>{{ count }}</p>
    <button (click)="likeAndSubscribe()">click me!</button>
  `,
})
export class NavbarComponent {
  count = 0;
  likeAndSubscribe() {
    this.count++;
  }
}
```

# Directives
* _Angular has a variety of directives for building complex template_

* -> **`*ngIf`** to handle conditional logic - **render element when truthy**
```js
@Component({
  selector: 'app-navbar',
  templateUrl: `
    <p *ngIf="count >= 1">{{ count }}</p> 
  `,
})
```

* -> **`*ngFor`** - to **loop over an iterable value**
```js
@Component({
  selector: 'app-navbar',
  templateUrl: `
    <p *ngFor="let emoji of emojis">
      {{ emoji }}
    </p> 
  `,
})
export class NavbarComponent {
  emojis = ["A", "B", "C"];
}
```

# Dependency Injection
* -> when our apps grows to hundreds of components, we'll likely need **a way to share data and functionality between them**
* -> we can take our component logic here and extract it into a **`service`** which can be treated as **a global singleton throughout the application**
* -> any component that wants to use this state or logic can simply add this class to its **`constructor`**

```js
// service
@Injectable({
  providedIn: 'root'
})
export class CountService {
  count = 0;
  likeAndSubscribe() {
    this.count++;
  }
}

// component
@Component({
  selector: 'app-navbar',
  templateUrl: `
    <p>{{ counter.count }}</p>
    <button (click)="counter.likeAndSubscribe()">click me!</button>
  `,
})
export class NavbarComponent {
  constructor(public counter: CountService) {}
}
```

=========================================================================
# Bind typescript code to HTML
* -> **`interpolation`** - take a raw value from typescript and rendering it out in the HTML

```ts - home.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  clicked = false;
  title = `Angular ${VERSION.full} is rad!`;

  handleClick() {
    this.clicked = true;
  }
}
```

```html - home.component.html
<!-- interpolate 'title' into template -->
<h1>{{ title }}</h1>

<!-- bind data to attribute 'disabled' in HTML -->
<!-- bind method to 'click' event of button in HTML -->
<button [disabled]="clicked" (click)="handleClick()">
  Click Me
</button>
```

* -> now to actually use our working component within the context of our Angular application, the basic way is to declare it in the HTML with its **`selector`**
```html
<app-home></app-home>

<router-outlet></router-outlet>
```