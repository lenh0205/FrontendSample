# window.name
* -> stored in the **`browser's process memory`**
* -> setter: **`window.name = "foo"`** ; getter: **`window.name`**
* -> data chỉ tồn tại trên 1 window (tab) duy nhất
* -> tắt window (tab) thì mất
* -> Để tích hợp với `react-router-dom`: https://dev.to/eons/detect-page-refresh-tab-close-and-route-change-with-react-router-v5-3pd

```js - to open a default confim dialog of Browser for saving change before reload
//  3 methods "e.preventDefault()", "e.returnValue = ''" and "return ''" is to prevent the event from executing and open the confirm dialog
// Note: the dialog only onpen when user have interacted with browser
window.onbeforeunload = (event) => {
  const e = event || window.event;
  e.preventDefault();
  if (e) {
    e.returnValue = ''; 
  }
  return ''; 
};
```

# LocalStorage
* -> browser storage is stored on the local hard drive (HDD) or solid-state drive (SSD) of the user's computer
* -> AppData\Local\Google\Chrome\User Data\Default\Local Storage

# SessionStorage
* browser storage is stored on the local hard drive (HDD) or solid-state drive (SSD) of the user's computer

# Cookie

# JSONP