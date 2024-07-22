
# Solution
https://stackoverflow.com/questions/47413520/restrict-css-applying-on-a-particular-div
https://stackoverflow.com/questions/15901030/how-to-reset-remove-css-styles-for-a-specific-element-or-selector-only

=====================================================================
# CSS scoping
* -> **`CSS styles`** are either **global in scope** or **scoped to a shadow tree**

## Can I use:
* -> **Deprecated** method of **`allowing scoped CSS styles`** **using a "scoped" attribute**; now **`removed from the specification`**
* -> replaced by the **Scopes Styles: @scope CSS rule** 
* -> we can also use **Shadow DOM**

* **Globally scoped styles** 
* -> apply to **all the elements in the node tree that match the selector**, including custom elements in that tree (_but `not to the shadow trees composing each custom element`_)

* **Shadow tree**
* -> selectors and their associated style definitions **`don't bleed between scopes`**
* -> within the CSS of a shadow tree, **selectors don't select elements outside the tree**, either in the **`global scope`** or in **`other shadow trees`**
* -> **each custom element has its own shadow tree**, which **`contains all the components that make up the custom element`** (_but not the custom element, or "host", itself_)

## Discussion
* both **`shadow-DOM`** and the **`abandoned "scope" specification`** were focused around **strong isolation**

* **Shadow Encapsulation (Shadow-DOM)** 
* -> describes **a persistent one-to-one relationship in the DOM** between a **`shadow host`** and its nested **`shadow tree`**
* -> **multiple overlapping scopes** can be defined in relation to the same elements

* meanwhile, **`most of the user-land "scope" tools for CSS`** (_Ex: **CSS Modules** or **Styled Components**_) 
* -> have a much lighter touch, **low-isolation** (_focus on **`unique namespacing for styling`**_)

## @scope
* https://www.w3.org/TR/css-cascade-6/#scoped-styles
* https://developer.mozilla.org/en-US/docs/Web/CSS/@scope

## Shadow DOM 
* xem `~\Features\HTML\DOM` để hiểu