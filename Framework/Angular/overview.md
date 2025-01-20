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
``` 

* -> **`@Component`** decorate
```cs -  - in the typescript file of "navbar"
@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

}
```