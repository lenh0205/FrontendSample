
==================================================
# Use Case: chỉ sửa 1 "single instance" of a component
* Sử dụng **sx prop** là thích hợp nhất
* -> nó mạnh hơn Theme
* -> can be used with **`all Material UI components`**

## Case: Sửa 1 "Nested Component" con của 1 Complex Component
* use the global **class name** provided by Material UI **`inside the sx prop`** to customize a specific part of a component
* use `browser's dev tools` to **`identify the class for the component slot`** need to override

* VD: change the `Slider` component's thumb from a circle to a square
* -> In this case, the styles are applied with `.css-ae2u5c-MuiSlider-thumb`
* -> but we **only really need to target the .MuiSlider-thumb** (_where "Slider" is the `component` and "thumb" is the `slot`_)
* -> **Lưu ý**: These class names `can't be used as CSS selectors` because they are unstable
```jsx
<Slider
  defaultValue={30}
  sx={{
    width: 300,
    color: 'success.main',
    '& .MuiSlider-thumb': {
      borderRadius: '1px',
    },
  }}
/>    
```

## Case: ta dùng những custom "class name" có sẵn CSS để override
* use **classname prop** **`available on each component`**

## Đối với những State như "hover, focus, disabled and selected"
* những "States" này được styled with a **`higher CSS specificity`**
* -> để customize đc chúng ta cần  **increase specificity**
* -> But we **`can't always use a CSS pseudo-class`**, as the "state" doesn't exist in the web specification
* -> in this situation, we can use MUI **state classes**, which act just like `CSS pseudo-classes`

* (_`CSS pseudo-classes` have a `high level of specificity`. For consistency with native elements,`` Material UI's state classes` have `the same level of specificity` as CSS pseudo-classes_)

* custom `state classes` are available in Material UI: .Mui-active, .Mui-checked, .Mui-completed, .Mui-disabled, .Mui-error, .Mui-expanded, .Mui-focusVisible, .Mui-focused, .Mui-readOnly, .Mui-required, .Mui-selected

```css
<Button disabled className="Button">
.Button { /* normal */
  color: black;
}
.Button:disabled { /* Increase the specificity */
  color: white;
}

/* Case: "state" doesn't exist - MenuItem component and its selected state */
<MenuItem selected className="MenuItem">
.MenuItem { 
  color: black;
}
/* Target the ".Mui-selected" global class name to customize the special state of the MenuItem component */
.MenuItem.Mui-selected { /* Increase the specificity */
  color: blue;
}
```
* **Lưu ý**: never apply styles directly to state class names; always target a state class together with a component (_`VD: .MuiOutlinedInput-root.Mui-error`_)


==================================================
# Use Case: Tạo 1 resuable custom Component để sử dụng ở nhiều nơi
* using the **styled()** utility

```tsx - VD: custom lại Slider
const SuccessSlider = styled(Slider)<SliderProps>(({ theme }) => ({
  width: 300,
  color: theme.palette.success.main,
  '& .MuiSlider-thumb': {
    '&:hover, &.Mui-focusVisible': {
      boxShadow: `0px 0px 0px 8px ${alpha(theme.palette.success.main, 0.16)}`,
    },
    '&.Mui-active': {
      boxShadow: `0px 0px 0px 14px ${alpha(theme.palette.success.main, 0.16)}`,
    },
  },
}));
```
```js - VD: custom lại 1 Tab
const AntTabs = styled(Tabs)({
  borderBottom: '1px solid #e8e8e8',
  '& .MuiTabs-indicator': {
    backgroundColor: '#1890ff',
  },
});

const AntTab = styled((props) => <Tab disableRipple {...props} />)(({ theme }) => ({
  textTransform: 'none',
  minWidth: 0,
  [theme.breakpoints.up('sm')]: {
    minWidth: 0,
  },
  fontWeight: theme.typography.fontWeightRegular,
  marginRight: theme.spacing(1),
  color: 'rgba(0, 0, 0, 0.85)',
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
  '&:hover': {
    color: '#40a9ff',
    opacity: 1,
  },
  '&.Mui-selected': {
    color: '#1890ff',
    fontWeight: theme.typography.fontWeightMedium,
  },
  '&.Mui-focusVisible': {
    backgroundColor: '#d1eaff',
  },
}));

<AntTabs value={value} onChange={handleChange} aria-label="ant example">
  <AntTab label="Tab 1" />
  <AntTab label="Tab 2" />
  <AntTab label="Tab 3" />
</AntTabs>
```

## Case: Tạo Dynamic style với "dynamic CSS" - tức là style có khả năng thay đổi theo logic của 1 biến

```tsx
<StyledSlider success={success} defaultValue={30} sx={{ mt: 1 }} />

interface StyledSliderProps extends SliderProps {
  success?: boolean;
}

const StyledSlider = styled(Slider, {
  shouldForwardProp: (prop) => prop !== 'success',
})<StyledSliderProps>(({ success, theme }) => ({
  width: 300,
  ...(success && {
    color: theme.palette.success.main,
    '& .MuiSlider-thumb': {
      [`&:hover, &.Mui-focusVisible`]: {
        boxShadow: `0px 0px 0px 8px ${alpha(theme.palette.success.main, 0.16)}`,
      },
      [`&.Mui-active`]: {
        boxShadow: `0px 0px 0px 14px ${alpha(theme.palette.success.main, 0.16)}`,
      },
    },
  }),
}));
``` 

## Tạo Dynamic style vói "CSS variable"
* cũng tương tự như trên nhưng dùng `CSS variable thôi`


======================================================
# Use Case: Tạo 1 style nhất quán cho "all components" across user interface 
* Material UI provides **theme tools** for managing style consistency


======================================================
# Use Case: add "global baseline styles" for some of the "HTML elements"
* use the **GlobalStyles** component (_`ghi đè được cả CSS baseline    `_)
```jsx
import GlobalStyles from '@mui/material/GlobalStyles';

export default function GlobalCssOverride() {
  return (
    <React.Fragment>
      <GlobalStyles styles={{ h1: { color: 'grey' } }} />
      <h1>Grey h1 element</h1>
    </React.Fragment>
  );
}

// It is a good practice to hoist the <GlobalStyles /> to a static constant, to avoid rerendering
// -> ensure that the <style> tag generated would not recalculate on each render
const inputGlobalStyles = <GlobalStyles styles={...} />;

function Input(props) {
  return (
    <React.Fragment>
      {inputGlobalStyles}
      <input {...props} />
    </React.Fragment>
  )
}
```

```jsx
// we can achieve the same by using  "CssBaseline" component
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        h1 {
          color: grey;
        }
      `,
    },
  },
});
export default function OverrideCssBaseline() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <h1>Grey h1 element</h1>
    </ThemeProvider>
  );
}
```

```jsx
// we can achieve the same by using "styleOverrides" key with "callback" in the "MuiCssBaseline" component slot from which we're "able to access the theme"
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    success: {
      main: '#ff0000',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: (themeParam) => `
        h1 {
          color: ${themeParam.palette.success.main};
        }
      `,
    },
  },
});
export default function OverrideCallbackCssBaseline() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <h1>h1 element</h1>
    </ThemeProvider>
  );
}
```
