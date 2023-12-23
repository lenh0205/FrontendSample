
# Dialog vs Modal
* dialog/modal is `simply a popup` that appears on top of the current page

# Modal
* supposed to take complete **priority over the page** and `prevent the user from interacting` with the page until the modal is closed
* trong MUI, Modal _`is a lower-level construct`_ để tạo: **Dialog**, **Drawer**, **Menu**, **Popover**

# Dialog
* A Dialog is a **`type of "modal" window`** that appears in front of app content to provide critical information or ask for a decision
* In MUI, Dialogs **disable all app functionality** when they appear, and remain on screen until confirmed, dismissed, or a required action has been taken
* `Dialogs` are **overlaid modal paper** based components with a **backdrop**

## Child component của "Dialog"
* 1 số **child component** dành riêng cho Dialog bao gồm: `DialogTitle, DialogContent > DialogContentText, DialogActions`
* -> những component này sẽ có `CSS tương tác với nhau` (_không có logic interact_)
* => ta cần viết đúng thứ tự các component, việc chèn 1 component loại khác vô giữa có thể làm mất CSS mặc định


## DialogTitle
* the props of the **Typography** component are also available in `DialogTitle`

## DialogContent
* về cơ bản nó là **Divider**

* `Props list`:
* **children**: It is used to denote the **`content of the divider`**
* **classes**: It is to override or extend the styles applied to the component.
* **dividers**: It takes a boolean value to display **`top and bottom dividers`**,
* **sx**: It is used to add custom CSS **`styles to the divider`**

* **CSS Rules**:
* -> root (**MuiDivider-root**):  It is the style applied to the root element.
* -> dividers(**`MuiDialogContent-dividers`**): It applies styles when the divider is true

### DialogContentText
* the props of the **Typography** component are also available in `DialogContentText`