# git-status
* show the **`working tree status`** - **git status [<options>] [--] [<pathspec>…​]**

* -> displays paths that have differences between the **index file** and **the current HEAD commit**
* -> paths that have differences between the **working tree** and the **index file**
* -> paths in the working tree that are **not tracked by Git and are not ignored by .gitignore**

* _the first are what we would commit by running **`git commit`**_
* _the second and third are what you could commit by running **`git add`** before running git commit_