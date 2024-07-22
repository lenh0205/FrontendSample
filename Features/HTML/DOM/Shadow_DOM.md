# Shadow DOM:
https://css-tricks.com/playing-shadow-dom/
https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM

==================================================
https://webpack.js.org/loaders/style-loader/
https://webpack.js.org/loaders/css-loader/
https://stackoverflow.com/questions/60659473/inject-css-styles-to-shadow-root-via-webpack
https://gourav.io/blog/render-react#render-react-element-with-shadow-dom-approach
https://developer.mozilla.org/en-US/docs/Web/CSS/@scope
https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM
https://www.w3.org/TR/css-cascade-6/#scoped-styles
https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scoping
https://drafts.csswg.org/css-cascade-6/#scoped-styles
https://developer.mozilla.org/en-US/docs/Web/CSS/@import
https://css-tricks.com/playing-shadow-dom/
https://css-tricks.com/saving-the-day-with-scoped-css/
https://css.oddbird.net/scope/
https://stackoverflow.com/questions/47413520/restrict-css-applying-on-a-particular-div

# Triển khai Shadow DOM cho React (using 'create-react-app')

## Step 1 thay đổi React root render:
```js
const container = document.querySelector('#root-SoGTVT');
const shadowRoot: any = container?.attachShadow({ mode: "open" });

const root = ReactDOM.createRoot(shadowRoot);
root.render(<App/>);
```

## Vấn để: mất hết CSS 
* -> lưu ý 1: có thể chia CSS thành 2 loại: 1 nằm trực tiếp trong project do ta tự tạo, 1 nằm trong node_module để dành cho các thư viện
* -> lưu ý 2: khi chạy local, stylesheet sẽ ở dạng `internal style` (nằm trong các thẻ <style/> nằm trong thẻ <head/>), nhưng trong DevTool/Element khi hover vào <div id="root"> thì nó vẫn cho ta biết style này biết này thuộc về file .css nào (có đường dẫn đang hoàng, trông như `external style` vậy)
* -> lưu ý 3: nhưng khi ta build ra static, thì trong file index.html sẽ tự động có thêm <link/> đến main.css và <script/> đến bundle.js ; tức đây là `external style` 
* -> lưu ý 4: trong React project(create-react-app), dù ta không explicit `import` CSS thì khi bundle nó vẫn sẽ gom tất cả CSS ra giúp ta

## ToDo:
* kiểm tra xem ngoại trừ entry point là index.tsx ra thì javascript có run những file .js khác nếu chỉ import không, và thứ tự chạy như thế nào