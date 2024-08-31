---
title: "Git 中的撤销操作"
date: "2024-08-30 00:47:17"
---

> 本文是一个 b 站视频 [十分钟学会常用git撤销操作，全面掌握git的时光机](https://www.bilibili.com/video/BV1ne4y1S7S9) 的笔记。

Git 中的四个区域：

1. Disk
2. Staging (After git add)
3. Local (After git commit)
4. Remote (After git push)

## Disk

```shell
# git status -> Changes not staged for commit

git checkout <changed_file>
(git restore <changed_file>)
```

使用 `git checkout` 和 `git restore` 有相同的效果，`restore` 在更新的 git 版本中被引入，旨在避免使用 `checkout` 导致的歧义。

## Staging

在 `git add` 之后文件会来到 Staging 区域，此时可以使用 `git reset` 来撤销 `git add` 操作。

```shell
# git status -> Changes to be committed

git reset <changed_file>
(git restore --staged <changed_file>)
```

如果希望连同 Disk 上的修改一起撤销，则可以使用：

```shell
git checkout HEAD <changed_file>
```

`HEAD` 表示最近的一次 commit。

## Local

在 `git commit` 之后，文件会来到 Local 区域，此时可以使用 `git reset --soft` 来撤销 `git commit` 操作。

```shell
# git status -> Nothing to commit, working tree clean

git reset --soft HEAD~1
```

`git reset` 实际上有三种模式, soft、hard 和默认的 mixed。如果使用 `git reset HEAD~1` （或者加上 `--mixed`），则不仅会将 commit 撤销，还会将文件从 Staging 区域撤销到 Disk 区域。也就是说在 Staging 和 Local 使用 `git reset <changed_file>` 的效果是相同的。

如果使用 `git reset --hard`，则会将 commit 撤销，并且将文件从 Staging 区域和 Disk 区域全部撤销，回到上一次 commit 的状态。

`git revert` 和 `git reset` 的作用都是撤销，但是 `git revert` 会创建一个新的 commit 来撤销之前的 commit，而 `git reset` 则是直接撤销之前的 commit。`git revert` 接收 commit id 作为参数：

```shell
# git revert <commit_id>

git revert 70a0e42
(git revert HEAD~1)
```

## Remote

如果在代码已经被推送至远程仓库，撤销操作则需要分类讨论：

- **公有分支**：只许前进，不能后退，需要使用 `git revert` 来新增撤销修改的 commit。
- **个人分支**：没有协作要求，可以直接强制撤销代码。使用 `git reset --hard HEAD~1` 撤销本地 commit，然后使用 `git push --force` 强制推送至远程仓库。

既然提到了 `git push --force`，那么就不得不提 `git push --force-with-lease`，后者会在强制推送之前检查远程仓库是否有新的 commit，如果有，则会拒绝推送，从而避免覆盖他人的修改。
