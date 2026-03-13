# Git Reference — Commands from Part-5 Setup

---

## 1. Inspect repository state

```bash
git status                              # show working tree status
git status --short                      # compact version
git branch -a                           # list all local + remote branches
git remote -v                           # show remotes and their URLs
git log --oneline -5                    # last 5 commits, one line each
git log --oneline branchA..branchB      # commits in B not in A
git diff file.json                      # unstaged changes in a file
git merge-base branchA branchB          # find common ancestor commit
```

---

## 2. Branches

```bash
git switch -c new-branch        # create and move to new branch (modern)
git checkout -b new-branch      # same, older syntax
git switch existing-branch      # move to existing branch (modern)
git checkout existing-branch    # same, older syntax
git branch -d branch-name       # delete local branch (safe — merged only)
```

---

## 3. Remotes

```bash
git remote add myrepo https://github.com/user/repo.git   # add a second remote
git push origin branch-name                              # push branch to origin
git push myrepo branch-name                              # push to a different remote
git push origin --delete branch-name                     # delete remote branch
```

---

## 4. Staging and committing

```bash
git add path/to/folder/               # stage a folder (respects .gitignore)
git add file1 file2                   # stage specific files
git add -u -- path/                   # stage only modifications/deletions (no new files)
git commit -m "message"               # commit with message
```

---

## 5. Merging

```bash
git switch master
git merge --no-ff branch-name -m "Merge message"   # merge with explicit merge commit
```

> `--no-ff` (no fast-forward) preserves the branch topology in the log even when
> a fast-forward would be possible. Good practice for feature branches.

---

## 6. Undoing / cleaning up

```bash
git restore file.js         # discard unstaged changes to a file
git rm --cached file        # stop tracking a file (keeps it on disk)
```

---

## 7. .gitignore tips

- Add `.env` to ignore secret environment files
- Add `node_modules` to ignore installed dependencies
- A `.gitignore` in a subfolder applies rules relative to that folder
- If a file was already committed, `.gitignore` won't retroactively untrack it —
  use `git rm --cached <file>` first

---

## 8. Removing a nested .git (sub-repo → plain directory)

When you accidentally `git clone` inside an existing repo, the inner folder has
its own `.git` and becomes an untracked submodule-like directory. To fix:

```bash
rm -rf path/to/inner-repo/.git     # remove inner git history
git add path/to/inner-repo/        # now tracked as plain files
git commit -m "Add inner-repo as plain directory"
```

---

## 9. Rename detection

Git automatically detects renames when you `git add` both the deletion and the
new location in the same commit. Example output:

```
R  part-5/App.jsx -> part-5/blog/App.jsx
```

This keeps full file history intact across the rename.
