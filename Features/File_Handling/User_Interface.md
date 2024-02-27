# client-side Validate: file type, file size

* **accept** attribute
* -> restrict the **`types of files`** that users can upload
* -> but, **`doesn't strictly validate the selected files`**
* -> it serves **`as a way to guide users`** toward choosing the correct file types by providing hints to the browser
* => vậy nên ta sẽ cần **`client-side validation`** bằng javascript và **`server-side validation`**

```html
<form action="https://httpbin.org/post" method="post" enctype="multipart/form-data">
  <input name="file" type="file" multiple accept="image/webp, image/jpeg, image/png">
  <button type="submit">Upload</button>
</form>

<p>
  <strong>Uploading status:</strong>
  <span id="statusMessage">🤷‍♂ Nothing's uploaded</span>
</p>
```
```js
const statusMessage = document.getElementById('statusMessage');
const submitButton = document.querySelector('button');

const fileInput = document.querySelector('input');
fileInput.addEventListener('change', handleInputChange);

function handleInputChange() {
  resetFormState();
  try {
    assertFilesValid(fileInput.files);
  } catch (err) {
    updateStatusMessage(err.message);
    return;
  }
  submitButton.disabled = false;
}

function resetFormState() {
  submitButton.disabled = true;
  updateStatusMessage(`🤷‍♂ Nothing's uploaded`)
}
function assertFilesValid(fileList) { // throw an error when the file is unsupported
  const allowedTypes = ['image/webp', 'image/jpeg', 'image/png'];
  onst sizeLimit = 1024 * 1024; // 1 megabyte

  for (const file of fileList) {
    const { name: fileName } = file;

    if (!allowedTypes.includes(file.type)) { // check file type
      throw new Error(`❌ File "${fileName}" could not be uploaded. Only images with the following types are allowed: WEBP, JPEG, PNG.`);
    }
    if (fileSize > sizeLimit) { // check file size
      throw new Error(`❌ File "${fileName}" could not be uploaded. Only images up to 1 MB are allowed.`);
    }
  }
}
function updateStatusMessage(text) { // update "error" message when upload
  statusMessage.textContent = text;
}
```

=======================================================

# Tracking file upload progress - create Progress Bar
* -> Fetch API is a modern way of fetching resources in JavaScript
* -> but it still doesn't provide any way to **`track file uploading progress`**; we should use **XMLHttpRequest**

* the **progress** **`event handler`** of **xhr.upload** property can use 
* -> **`loaded`** property - the **`amount of work already performed`**
* -> **`total`** property - **`total size of the data`** being processed or transmitted respectively 

* _Để tạo 1 thanh progress bar cho user experient_
* **a <progress> element** indicate the **`completion progress of a task`**; it has two attributes **`max`** and **`value`**
* -> the **max** attribute describes **`how much work`** the task indicated by the progress element requires (_set value to 100 to operate it like a percentage_)
* -> the **value** attribute specifies **`how much of the task has already been completed`** (_update it progressively using JavaScript_)

```html
<progress value="0" max="100"></progress>
```
```js
const form = document.querySelector('form');
form.addEventListener('submit', handleSubmit);

function handleSubmit(event) {
  event.preventDefault();
  showPendingState();
  uploadFiles();
}

function uploadFiles() {
  const url = 'https://httpbin.org/post';
  const method = 'post';

  const xhr = new XMLHttpRequest();
  const data = new FormData(form);

  xhr.upload.addEventListener('progress', event => {
    updateStatusMessage(`⏳ Uploaded ${event.loaded} bytes of ${event.total}`);
    updateProgressBar(event.loaded / event.total);
  });

  xhr.addEventListener('loadend', () => {
    if (xhr.status === 200) {
        updateStatusMessage('✅ Success');
    } else {
        updateStatusMessage('❌ Error');
    }
    updateProgressBar(0); // reset the value after the uploading completes
  }); 

  xhr.open(method, url);
  xhr.send(data);

  function updateProgressBar(value) {
    const percent = value * 100;
    progressBar.value = Math.round(percent);
  }
}
```

=======================================================

# Display uploaded files information

* **FileList** object collects the **`information about all the files users select`**

```jsx
<p>
  <strong>Uploaded files:</strong>
  <span id="fileNum">0</span>
</p>
<ul id="fileListMetadata"></ul>

const fileNum = document.getElementById('fileNum');
const fileListMetadata = document.getElementById('fileListMetadata');

xhr.addEventListener('loadend', () => {
  if (xhr.status === 200) {
    // ...
    renderFilesMetadata(fileInput.files);
  } 
});

function renderFilesMetadata(fileList) {
  fileNum.textContent = fileList.length;

  fileListMetadata.textContent = '';
  for (const file of fileList) {
    const name = file.name;
    const type = file.type;
    const size = file.size;

    fileListMetadata.insertAdjacentHTML(
      'beforeend',
      `
        <li>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Type:</strong> ${type}</p>
          <p><strong>Size:</strong> ${size} bytes</p>
        </li>
      `,
    );
  }
}

function resetFormState() {
  submitButton.disabled = true;
  updateStatusMessage(`🤷‍♂ Nothing's uploaded`);
  fileListMetadata.textContent = '';
  fileNum.textContent = '0';
}
```

=======================================================

# Drag-and-Drop file uploading
* modern browsers _provide APIs_ that enable us to **`implement a drag-and-drop file`** **selector** and **uploader**

* The best practice to enhance user experience is to provide clear visual hints whenever a file can be securely dropped. It is often achieved by incorporating a dotted or dashed area.

* there are 8 events the browser fires **`related to drag and drop`**
* -> **dragenter** is fired when the **`dragged item enters over a drop area`**, making it the target for the drop event.
* -> **dragleave** is the opposite of dragenter and is fired when the **`dragged item leaves a target drop area`**
* -> **dragover** is **`fired every`** few hundred milliseconds while the **`dragged item is over a target drop area`**
* -> **drop** is **`fired once`** the **`user drops the item onto the target drop area`**

* **Note**: drag-and-drop events can be tricky
* -> _you **`can not intercept drop event`** if you do not prevent default behavior on dragenter and dragover_
* -> _it's hard to determine **`where exactly user is going to drop`** something because drag-events are fired not only on the drop area itself, but also on its children_
* -> ......

## Make Drag-and-Drop area

```jsx
// wrap the "form" with a div that would be a drop area
<div id="dropArea">
  <form>
      {/* ..... */}
  </form>
</div>

const dropArea = document.getElementById('dropArea');

function initDropAreaHighlightOnDrag() {
  let dragEventCounter = 0;

  dropArea.addEventListener('dragenter', event => {
    event.preventDefault();

    if (dragEventCounter === 0) {
      // add highlight to "dropArea" for user experience
      dropArea.classList.add('highlight');
    }

    dragEventCounter += 1;
  });

  dropArea.addEventListener('dragover', event => {
    event.preventDefault();

    // in case of non triggered dragenter!
    if (dragEventCounter === 0) {
      dragEventCounter = 1;
    }
  });

  dropArea.addEventListener('dragleave', event => {
    event.preventDefault();

    dragEventCounter -= 1;

    if (dragEventCounter <= 0) {
      dragEventCounter = 0;
      dropArea.classList.remove('highlight');
    }
  });

  dropArea.addEventListener('drop', event => {
    event.preventDefault();

    dragEventCounter = 0;
    dropArea.classList.remove('highlight');
  });
}
initDropAreaHighlightOnDrag();
```

## Drag-and-drop file uploader
* implement **`behaviour`** of our uploader that happens **`right after the user drops the item`**

* The **DataTransfer** object is used to **`hold the data`** that is **`being dragged`** during a drag and drop operation
* -> we will use **files** property to get our **`dropped files list`**

* **Note**: _file uploaders could be much more powerful: control who can upload files by authenticating requests, set up server-side validation, and edit files right before uploading by cropping, rotating, and filtering them._

```js
dropArea.addEventListener('drop', handleDrop);

function handleDrop(event) {
  const fileList = event.dataTransfer.files;
  resetFormState();

  try {
    assertFilesValid(fileList);
  } catch (err) {
    updateStatusMessage(err.message);
    return;
  }

  showPendingState();
  uploadFiles(fileList);
}

function uploadFiles(files) {
  // ....XHR-related code stays the same
  const data = new FormData();
  for (const file of files) {
    data.append('file', file);
  }
  // ....XHR-related code stays the same
}

renderFilesMetadata(files);

function handleSubmit(event) {
  event.preventDefault();
  showPendingState();

  uploadFiles(fileInput.files);
}
```