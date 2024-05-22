
# git cherry-pick
* -> để lấy 1 commit từ 1 nhánh khác về nhánh hiện tại
https://stackoverflow.com/questions/36975986/cherry-pick-shows-no-m-option-was-given-error

```r
git cherry-pick <SHA>

# trong trường hợp commit ta muốn lấy là 1 merge commit
# -> ta sẽ cần thêm "-m <parent-number>" option
git cherry-pick -m 1 <SHA>
```

# git rebase


# log commit between 2 dates
```js
git log --since="2022-04-22" --until="2022-04-24" // from '22 April 2022' to '24 April 2022'
git log --after="2014-7-1" --before="2014-7-4" 

git log --since='Apr 1 2021' --until='Apr 4 2021'
git log --since='2 weeks ago'
git log --until='yesterday'
```

# delete branch

```js
// delete branch locally
git branch -d localBranchName

// delete branch remotely
git push origin --delete remoteBranchName

// Error: unable to push to unqualified destination: remoteBranchName The destination refspec neither matches an existing ref on the remote nor begins with refs/, and we are unable to guess a prefix based on the source ref. error: failed to push some refs to 'git@repository_name'
// -> someone else has already deleted the branch
// -> we just need to synchronize our branch list:
git fetch -p
```