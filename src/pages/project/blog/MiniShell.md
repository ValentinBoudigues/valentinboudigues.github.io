---
layout: "../../../layouts/project.astro"
title: "MiniShell"
description: "Shell in C"
publishDate: "Oct 18 2022"
tags:
    - C
    - Handling signals
    - Data Structures
---

### Used Skills :

-   [x] C
-   [x] Handling signals
-   [x] Data Structures

### Description :

For this project, we had to recreate a shell in C.

The shell had to be able to execute commands with or without arguments, as well as the built-in commands `cd`, `exit`.

For commands with arguments, the commands should be preceded by `!` to be executed and read arguments.

We needed to recreate the `system()` command with `fork()`, `execve()` and `waitpid()`.

We also had to make asynchronous commands with `&`.

- Time limit : 1 months

- [GitLab depository](https://gitlab-ce.iut.u-bordeaux.fr/qlebez/sae-minishell)