* Only the **`Box, Stack, Typography, Grid`** components accept the **system properties** (xem phần MUI System Properties) as props 
```js
<Box height={20} width={20} my={4} display="flex" alignItems="center" gap={4}>
```

* Box is a lightweight component that gives access to the sx prop -> used as a utility component, and as a wrapper for other components

================================================
# Theme

# API: createTheme(options, ...args) => theme
* ta cần dùng **ThemeProvider** component  in order to inject a theme into your application (_nó s/d context của React_)
* However, this is optional; Material UI components come with **`a default theme`**

```js - basic create theme - Custom breakpoints
declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: false; // removes the `xs` breakpoint
    sm: false;
    md: false;
    lg: false;
    xl: false;
    tablet: true; // adds the `tablet` breakpoint
    laptop: true;
    desktop: true;
  }
}
const theme = createTheme({
  breakpoints: {
    values: {
      mobile: 0,
      tablet: 640,
      laptop: 1024,
      desktop: 1280,
    },
  },
});
<ThemeProvider theme={theme}>
  <Box
    sx={{
      width: {
        mobile: 100,
        laptop: 300,
      },
    }}
  >
    This box has a responsive width
  </Box>
</ThemeProvider>
```

```js - define the basic design options, then use it to compose other options
import { red } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';

let theme = createTheme({
  palette: {
    primary: {
      main: red[500],
    },
    secondary: {
      main: '#edf2ff',
    },
  },
});
theme = createTheme(theme, {
  palette: {
    info: {
      main: theme.palette.secondary.main,
    },
  },
});
```

* **component** key of theme to achieve styling consistency across your application
```js
// "defaultProps" change default values for each of a Material UI `component props`
const theme = createTheme({
  components: {
    MuiButtonBase: { // Name of the component
      defaultProps: { 
        disableRipple: true, // No more ripple, on the whole application 💣!
      },
    },
  },
});

// "styleOverrides" key change every single `style injected into the DOM` by Material UI 
const theme = createTheme({
  components: {
    MuiButton: { // Name of the component
      styleOverrides: {
        root: { // Name of the "slot" (nằm trong phần CSS của component API)
          fontSize: '1rem',
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        valueLabel: ({ ownerState, theme }) => ({ // pass callback to styles based on props
          ...(ownerState.orientation === 'vertical' && {
            backgroundColor: 'transparent',
            color: theme.palette.grey[500],
          }),
        }),
      },
      // "ownerState" = public props we pass to component + internal state of the component
    },
    MuiChip: {
      styleOverrides: {
        root: ({ theme }) =>
          // "unstable_sx" - modify styles within the theme using `shorthand` CSS notation
          theme.unstable_sx({
            px: 1,
            py: 0.25,
            borderRadius: 1, // theme.shape.borderRadius * 1 = 4px as default.
          }),
        label: {
          padding: 'initial',
        },
        icon: ({ theme }) =>
          theme.unstable_sx({
            mr: 0.5,
            ml: '-2px',
          }),
      },
    },
  },
});

// "variants" key create new variants to Material UI components 
// -> these new variants can specify what styles the component should have when that specific variant "prop" value is applied
// -> the definitions are specified in an array and the order is important
const theme = createTheme({
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: 'dashed' },
          style: {
            textTransform: 'none',
            border: `2px dashed ${blue[500]}`,
          },
        },
        {
          props: { variant: 'dashed', color: 'secondary' },
          style: {
            border: `4px dashed ${red[500]}`,
          },
        },
      ],
    },
  },
});
declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    dashed: true;
  }
}
<Button variant="dashed" sx={{ m: 1 }}>Dashed</Button> // nút màu xanh
<Button variant="dashed" color="secondary" sx={{ m: 1 }}>Secondary</Button> // nút màu tím
```

* `Addtional variable` - những thằng access được theme đều s/d được
```js - Add additional variable into Theme
// have to use "module augmentation" to add new variables to the "Theme" and "ThemeOptions":
declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
  }
  interface ThemeOptions { // allow configuration using `createTheme`
    status?: {
      danger?: string;
    };
  }
}
const theme = createTheme({
    status: { // add additional variables to the theme so you can use them everywhere
        danger: orange[500],
    },
});

// Usage:
const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
  color: theme.status.danger, // use addition variable defined in theme
  '&.Mui-checked': {
    color: theme.status.danger,
  },
}));
export default function CustomStyles() {
  return (
    <ThemeProvider theme={theme}>
      <CustomCheckbox defaultChecked />
    </ThemeProvider>
  );
}
```

* **deepmerge**
```js - merge 2 option deep into 1 theme
const theme = createTheme(deepmerge(options1, options2));
```


* **useTheme()**
```js - "useTheme()" hook
import { useTheme } from '@mui/material/styles';

function DeepChild() {
  const theme = useTheme();
  return <span>{`spacing ${theme.spacing}`}</span>;
}
```

==============================================
# sx() prop
* cho phép viết shortcut để CSS

```js - use sx() prop 
import { Theme } from '@mui/material/styles';
const theme = createTheme({
  palette: {
    background: {
      paper: '#fff',
    },
    text: {
      primary: '#173A5E',
      secondary: '#46505A',
    },
    action: {
      active: '#001E3C',
    },
    success: {
      dark: '#009688',
    },
  },
});
<Box
  sx={{
    bgcolor: 'background.paper',
    color: (theme: Theme) => theme.palette.primary.main,
    width: 1/2, // 50%
    width: 20, // 20px,
    width: { xs: 100, sm: 200 }, // theme.breakpoints.up('xs')
    width: [100, null, 300], // assumpt theme only have 3 breakpoints from smallest to largest
    margin: 2, // theme => theme.spacing(2) (default for the value is 8px)
    p: 2, // ngoài ra còn có m, mt, mr, mb, ml, mx, my, pt, ....
    fontWeight: 'light', // theme.typography.fontWeightLight,
    typography: 'body1', // sets all values defined in theme.typography.body1 to component 
    border: 1, // border: '1px solid black'
    borderRadius: 2, // theme.shape.borderRadius * 2 (the default for this value is 4px)
    displayPrint: 'none', // '@media print': { display: 'none' }
    gap: 2, // Grid css, gap: theme => theme.spacing(2) (same for rowGap and columnGap)
    zIndex: 'tooltip' // zIndex: theme => theme.zIndex.tooltip
    boxShadow: 1, // boxShadow: theme => theme.shadows[1]
    mx: 0.5,
    ":hover": { // pseudo-selectors
      boxShadow: 6,
    },
    '@media print': { // media query
      width: 300,
    },
    '& .ChildSelector': { // assumpt "ChildSelector" as nested selector
      bgcolor: 'primary.main',
    },
  }}
>
<Box
  sx={(theme) => ({
    ...theme.typography.body,
    color: theme.palette.primary.main,
  })}
/>
<Box
  // tuỳ theo 2 biến "foo", "bar" mà hover sẽ ra css 1 trong 3 CSS; 
  // higher index of the array has higher specificity
  sx={[
    {
      '&:hover': {
        color: 'red',
        backgroundColor: 'white',
      },
    },
    foo && {
      '&:hover': { backgroundColor: 'grey' },
    },
    bar && {
      '&:hover': { backgroundColor: 'yellow' },
    },
  ]}
/>
<Box
  sx={[
    { mr: 2, color: 'red' },
    (theme) => ({
      '&:hover': {
        color: theme.palette.primary.main,
      },
    }),
  ]}
/>
```

```js - passing the sx prop from our custom component to MUI component
<ListHeader
  sx={(theme) => ({
    color: 'info.main',
    ...theme.typography.overline,
  })}
>
  Header
</ListHeader>

interface ListHeaderProps {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}
function ListHeader({ sx = [], children }: ListHeaderProps) {
  return (
    <ListItem
      sx={[
        {
          width: 'auto',
          textDecoration: 'underline',
        },
        // You cannot spread `sx` directly because `SxProps` (typeof sx) can be an array.
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <FormLabel sx={{ color: 'inherit' }}>{children}</FormLabel>
    </ListItem>
  );
}
```

```js - TypeScript usage
const style = {
  flexDirection: 'column',
} as const; // phải có

export default function App() {
  return <Button sx={style}>Example</Button>;
}
```

==============================================
# styled()
* Utility for **`creating styled components`**; built on top of the styled() module of @mui/styled-engine
* **`All MUI components`** are styled with the styled() utility

* có thể import từ `@mui/system` hoặc `@mui/material/styles` đều được (the difference is in the default theme)

## Create custom styled() utility (have a different default theme)
* using the **`createStyled()`** utility
```js
import { createStyled, createTheme } from '@mui/system';
const defaultTheme = createTheme({
  // your custom theme values
});
const styled = createStyled({ defaultTheme });
export default styled;
```

# API - styled(Component, [options])(styles) => Component
* **options**: 
* -> **`shouldForwardProp`** _(prop: string) => bool_ - configure which props should be forwarded on DOM (nó sẽ lặp và pass các props của component vào function kiểm tra điều kiện; true thì forward prop)
* -> label
* -> name
* -> slot
* -> **`overridesResolver`** _(props: object, styles: Record<string, styles>) => styles [optional]_ : Function that returns styles based on the props and the theme.components[name].styleOverrides object
* -> styleOverrides, 
* -> skipVariantsResolver
* -> skipSx

* **styles**: **`a styles object`** or **`a function return a styles object`** that receives the theme and component's props in an object as a single argument 

# Example
```js - Basic usage with HTML Element
import { styled, createTheme, ThemeProvider } from '@mui/system';

const customTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      contrastText: 'white',
    },
  },
});
const MyThemeComponent = styled('div')(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  backgroundColor: theme.palette.primary.main,
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
}));
export default function ThemeUsage() {
  return (
    <ThemeProvider theme={customTheme}>
      <MyThemeComponent>Styled div with theme</MyThemeComponent>
    </ThemeProvider>
  );
}
```

```js - create Custom Components - with the same capabilities as the "MUI core components"
interface MyThemeComponentProps {
  color?: 'primary' | 'secondary';
  variant?: 'normal' | 'dashed';
}

const customTheme = createTheme({
  components: {
    MyThemeComponent: {
      styleOverrides: {
        root: {
          color: 'darkslategray',
        },
        primary: {
          color: 'darkblue',
        },
        secondary: {
          color: 'darkred',
          backgroundColor: 'pink',
        },
      },
      variants: [
        {
          props: { variant: 'dashed', color: 'primary' },
          style: {
            border: '1px dashed darkblue',
          },
        },
        {
          props: { variant: 'dashed', color: 'secondary' },
          style: {
            border: '1px dashed darkred',
          },
        },
      ],
    },
  },
});

const MyThemeComponent = styled('div', {
  shouldForwardProp: (prop) => prop !== 'color' && prop !== 'variant' && prop !== 'sx',

  name: 'MyThemeComponent',
  slot: 'Root',
  // create "MyThemeComponent-root" class when inspect component in DevTool

  overridesResolver: (props, styles) => [ // decide how styleOverrides are being applied 
    // -> styles - define through "styleOverrides" when create theme
    // -> props - base on what user pass to this custom component
    styles.root,
    props.color === 'primary' && styles.primary,
    props.color === 'secondary' && styles.secondary,
  ],
})<MyThemeComponentProps>(({ theme, ...props }) => ({ // theme and Component prop
  backgroundColor: 'aliceblue',
  padding: theme.spacing(1),
  margin: 1, // means "1px", NOT "theme.spacing(1)"
}));

export default function UsingOptions() {
  return (
    <ThemeProvider theme={customTheme}>
      <MyThemeComponent sx={{ m: 1 }} color="primary" variant="dashed">
        Primary
      </MyThemeComponent>
      <MyThemeComponent sx={{ m: 1 }} color="secondary">
        Secondary
      </MyThemeComponent>
    </ThemeProvider>
  );
}
```

* to use use the **`sx syntax`** in styled(), ta có thể s/d **unstable_sx** utility from the `theme`
```js
const customTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      contrastText: 'white',
    },
  },
});
const MyThemeComponent = styled('div')(({ theme }) =>
  theme.unstable_sx({
    color: 'primary.contrastText',
    backgroundColor: 'primary.main',
    padding: 1,
    borderRadius: 1,
  }),
);
```

==============================================
# Color:
```js
<RestoreIcon sx={{ color: blue[500] }}/>
```