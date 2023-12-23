
# Mục đích
* static type checking help us get to **`learn about potential bugs`** as you're typing the code, than heading to the browser and **`figuring out at runtime`**
* provides a way to **`describe the shape of an object`** hence providing better documentation and autocomplete
* makes **`maintenance and refactoring of large code bases`** much easier

```js - VD:
// pass props as Object
const personName = { first: "Lee", last: "sin" }
<Greet name={personName} isLoggedIn={false}/>

type GreetProps = {
    name: {
        first: string,
        last: string
    },
    messageCount?: number, // optional
    isLoggedIn: boolean
}
export const Greet = (props: GreetProps) => {
    return (
        <h2>
            {props.isLoggedIn
                ? `Welcome ${props.name.first}! you have ${props.messageCount} unread message`
                : 'welcome'}
        </h2>
    )
}

// pass props as Array:
const nameList = [{ first: "Lee", last: "sin" }, { first: "ya", last: "suo" }]
<PersonList names={nameList}/>

type PersonListProps = {
    names: {
        first: string,
        last: string
    }[]
}
export const PersonList = (props: PersonListProps) => {
    return (
        <div>
            {props.names.map(name => {
                return <h2 key={name.first}>{name.first} {name.last}</h2>
            })}
        </div>
    )
}

// limit value - Union
<Status status="loading"/>

type StatusProps = {
    status: 'loading' | 'success' | 'error' // Union of string
}
export const Status = (props: Status Props) => {
    let message
    if (props.status === 'loading') {
        message = 'Loading...'
    } else if (props.status === 'success') {
        message = 'Data fetched successfully!'
    } else if (props.status === 'error') {
        message = 'Error fetching data'
    }
    return (
        <div>
            <h2>Status - {message}</h2>
        </div>
    )
}

// "children" as a prop:
<Oscar>
    <Heading>Text</Heading>
</Oscar>

type HeadingProps = {
    children: string
}
export const Heading = (props: HeadingProps) => {
    return <h2>{props.children}</h2>
}

type OscarProps = {
    children: React.ReactNode // from @types/react
}
export const Oscar = (props: OscarProps) => {
    return <div>{props.children}</div>
}

// "onclick" Event as prop
<Button handleClick={(event, id) => { console.log("clicked !!!", event) }}></Button>

type ButtonProps = {
    handleClick: (event: React.MouseEvent<HTMLButtonElement>, id: number) => void
}
export const Button = (props: ButtonProps) => {
    return <button onClick={(event) => props.handleClick(event, 1)}>Click</button>
}

// "onchange" Event as prop
<Input value="" handleChange={(event) => console.log(event)}>

type InputProps = {
    value: string,
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}
export const Input = (props: InputProps) => {
    return <input type="text" value={props.value} onChange={props.handleChange}>
}

```