* **Throttling** will delay executing a function. It will reduce the notifications of an event that fires multiple times.
* -> the original function will be called at most once per specified period

* **Debouncing** will bunch a series of sequential calls to a function into a single call to that function. It ensures that one notification is made for an event that fires multiple times.
* ->  the original function will be called after the caller stops calling the decorated function after a specified period


```js - use case
// Search bar- Don't want to search every time user presses key? Want to search when user stopped typing for 1 sec. Use debounce 1 sec on key press.
// Shooting game- Pistol take 1 sec time between each shot but user click mouse multiple times. Use throttle on mouse click.

// Reversing their roles:
// -> Throttling 1 sec on search bar- If users types abcdefghij with every character in 0.6 sec. Then throttle will trigger at first a press. It will will ignore every press for next 1 sec i.e. bat .6 sec will be ignored. Then c at 1.2 sec will again trigger, which resets the time again. So d will be ignored and e will get triggered.

// -> Debouncing pistol for 1 sec- When user sees an enemy, he clicks mouse, but it will not shoot. He will click again several times in that sec but it will not shoot. He will see if it still has bullets, at that time (1 sec after last click) pistol will fire automatically.
```

```js - Further explanation for input-output comparision with real life
// There are some guards outside a bar. Guard allows person who say "I will go" to let inside the bar. That is a normal scenario. Anyone saying "I will go" is allowed to go inside the bar.

// Now there is a Throttle Guard (throttle 5 sec). He likes people who responds first. Anyone who says "I will go" first, he allows that person. Then he rejects every person for 5 sec. After that, again anyone saying it first will be allowed and others will be rejected for 5 sec.

// There is another Debounce Guard (debounce 5 sec). He likes people who brings mental rest to him for 5 seconds. So if any person says "I will go", the guard wait for 5 seconds. If no other person disturbs him for 5 seconds, he allow the first person. If some other person says "I will go" in those 5 sec, he reject the first one. He again starts the 5 sec waiting for the second person to see if the second one can bring him the mental rest.
```
========================================================
> có vần đề trong việc phải hiện thị 1 list 1 triệu record quá lớn:
* -> http chịu không nổi nó trả về rỗng luôn
* -> Client chịu không nổi việc render 1 triệu DOM element (cái này dễ xảy ra hơn, tầm 1000 DOM element là đủ chết rồi)


========================================================
> A common requirement in web applications is displaying lists of data. Or tables with headers and scrolls
# what if you need to show thousands of rows at the same time?
* the pagination technique maybe an option but you still have to show a lot of information
* The infinite scrolling technique only limits rendering future elements and renders all previous rows, causing performance issues for very large lists

# Problem
* for rendering thousands of rows, the web browser will always create thousands of DOM elements even though a scrollbar typically hides overflowing content
* Rendering a new DOM element needs physical memory and consumes CPU and GPU hardware when DOM element positions get changed with user events, such as scrolling
* if we directly render large lists in web apps, the browser heavily uses the computer memory and increases CPU/GPU usage while rendering (especially with initial rendering phases)

# Solution
* One way is by using a library like react-virtualized, which renders large lists in a performance-friendly technique called virtual rendering
* This library typically **`renders only visible rows in a large list`** and creates fewer DOM elements to reduce the performance overhead in apps

# Mechanism
* **virtual rendering** - **`rendering only what is visible`**
* -> **`load only the elements that are visible`** and **`unload them when they are not`** by replacing them with new ones

#  Implements virtual rendering
* a set of components of `react-virtualized` that basically work in the following way:
* They calculate which items are visible inside the area where the list is displayed (the viewport) based on the scrollbar positions and the viewport size
* They use a container (div) with relative positioning to absolute position the children elements inside of it by controlling its top, left, width, and height style properties

================================================
# Caching
* những service lấy data cho Cbo nếu dùng lại nhiều trang, nhiều dialog cần được caching lại

================================================
# Reduce API Request on React app
* 