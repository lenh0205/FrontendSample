
# Get the "MIME type" of a File in the Browser
* -> access the **files** property on the **`input element`** with `a type of file`
* -> then, access the **type** property `on each file` to get its MIME type
* -> **Lưu ý**: browsers read the **`file's extension`** to determine its media type instead of **reading the bytestream of the file** (_nếu muốn ta phải tự làm_)

* VD: property returns the string **`image/png`** for _PNG images_; the string **`text/plain`** for _.txt files_

```js
<input type="file" id="file-input" multiple />

const fileInput = document.getElementById('file-input');

// access "files" directly
const filesProperty = fileInput.files;

fileInput.addEventListener('change', event => {
  // access "files" property through "event" (because "e.target" refer to "fileInput")
  const files = event.target.files;

  for (const file of files) {
    console.log(`filename: ${file.name}`);
    console.log(`file size: ${file.size} bytes`);
    console.log(`file type: ${file.type}`);

    const mimeType = file.type;
    console.log(mimeType);
  }
});
```

# Getting the "MIME type" of a file in the Browser by "reading the file"
* -> the user could **`change the MIME type`** of the file by **`changing its extension`**
* -> we can **read the first few bytes** of a file and **check its signature** to be sure that the file is of the given MIME type

```js
const fileInput = document.getElementById('file-input');

fileInput.addEventListener('change', event => {
  const files = event.target.files;

  for (const file of files) {
    getMimeType(file, mimeType => {
      console.log('The MIME Type is: ', mimeType);
    });
  }
});

function getMimeType(file, callback) {
  const fileReader = new FileReader();

  fileReader.onloadend = function (event) {
    let mimeType = '';
    let header = ''; 

    const arr = new Uint8Array(event.target.result).subarray(0, 4);

    for (let index = 0; index < arr.length; index++) {
      header += arr[index].toString(16);
    }

    console.log('Header:', header);

    // View other byte signature patterns here:
    // 1) https://mimesniff.spec.whatwg.org/#matching-an-image-type-pattern
    // 2) https://en.wikipedia.org/wiki/List_of_file_signatures
    switch (header) {
      case '89504e47': {
        mimeType = 'image/png';
        break;
      }
      case '47494638': {
        mimeType = 'image/gif';
        break;
      }
      case '52494646':
      case '57454250':
        mimeType = 'image/webp';
        break;
      case '49492A00':
      case '4D4D002A':
        mimeType = 'image/tiff';
        break;
      case 'ffd8ffe0':
      case 'ffd8ffe1':
      case 'ffd8ffe2':
      case 'ffd8ffe3':
      case 'ffd8ffe8':
        mimeType = 'image/jpeg';
        break;
      default: {
        mimeType = file.type;
        break;
      }
    }

    callback(mimeType);
  };

  fileReader.readAsArrayBuffer(file);
}
```