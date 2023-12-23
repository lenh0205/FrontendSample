
# MaterialUI Form
## TextField
* _TextField_ is composed of smaller components: **FormControl**, **Input**, **FilledInput**, **InputLabel**, **OutlinedInput**, and **FormHelperText**
* -> Ta có thể sử dụng để customizd form input của ta

*  _TextField_ takes care of the `most used properties of native HTML input` (_not all on purpose_)
* -> ta có thể dùng underlying component như trên
* -> hoặc sử  dụng **inputProps** (and **`InputProps, InputLabelProps properties`**) if you want to avoid some boilerplate

## FormControl
* provides **context** such as **`filled/focused/error/required`** for `form inputs`
* ensures state consistent across the **`children of the FormControl`**
* This context is used by the following components: **FormLabel**, **FormHelperText**,  **InputLabel**, **Input**, **FilledInput**, **OutlinedInput**
* **Only one InputBase** can be used within a FormControl  

* 1 số prop thường dùng: `fullWidth`

```js
<FormControl>
  <InputLabel htmlFor="my-input">Email address</InputLabel>
  <Input id="my-input" aria-describedby="my-helper-text" />
  <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText>
</FormControl>
```

## useFormControl
* returns the **value** object - **`context value of the parent FormControl component`**
* -> gồm properties: `disabled, error, filled, focused, required, size, ...`
* -> bắt events: `onBlur, onFocus, onEmpty, onFilled`

```js - Custom "FormHelperText"
export default function UseFormControl() {
  return (
    <form noValidate autoComplete="off">
      <FormControl sx={{ width: '25ch' }}>
        <OutlinedInput placeholder="Please enter text" />
        <MyFormHelperText />
      </FormControl>
    </form>
  );
}
function MyFormHelperText() {
  const { focused } = useFormControl() || {};

  const helperText = React.useMemo(() => {
    if (focused) {
      return 'This field is being focused';
    }

    return 'Helper text';
  }, [focused]);

  return <FormHelperText>{helperText}</FormHelperText>;
}
```

## FormControlLabel
* sử dụng component này nếu ta muốn display an **`extra label`** khi ta drop-in nó as **`a replacement`** of the **Radio**, **Switch**, **Checkbox** component

## FormGroup
* is a helpful wrapper used to **group selection control components** (nó wrap nhưng không làm gián đoạn sự liên kết giữa `FormControl` và `MUI control component`)
* provides **`compact row layout`** bằng cách `wraps controls` such as _Checkbox_ and _Switch_ (_RadioGroup for Radio_)
* -> **for visual purposes**; doesn't provide any additional logic or functionality 

## Input 
* nó là 1 input chỉ có bottom outline
* A specific input component
* simple input field with a **`variety of customization options`**

## OutlinedInput
* Nó là 1 input có đường outline

## FilledInput
* Nó là 1 input có bottom outline và có nền được fill màu xám

## InputBase
* Nó là 1 input nhưng trắng trơn không có gì cả
* **`a base component`** - to create `other input components`: **Input**, **FilledInput**, **OutlinedInput**
* `small set of props` to create **`basic functionality`** of an input component