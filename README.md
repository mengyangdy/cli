# DylanJS CLI

> 这是一个用于简化开发流程的命令行工具

## 安装

```bash
npm install -g @dylanjs/cli
```

## 使用

### git-commit

```bash
dy git-commit -l=zh-cn
```

此方法是用来提交自定义git commit的，并且支持中文，使用`-l`参数来指定语言，默认是英文，使用步骤如下：

1. 输入提交类型
2. 输入提交范围
3. 输入提交描述

然后会通过正则匹配出提交类型、提交范围、提交描述，然后拼接成git commit信息，最后执行git commit命令，然后执行git push命令即可。

在package.json中的scripts中添加`"cm": "git add . && dy git-commit -l=zh-cn"`命令，然后执行`pnpm run cm`即可提交代码，并且推送到远程仓库。

### git-commit-verify

```bash
dy git-commit-verify -l=zh-cn
```

此方法是用来验证git commit信息的，并且支持中文，使用`-l`参数来指定语言，默认是英文，使用步骤如下：

1. 输入git commit信息
2. 验证git commit信息是否符合规范

### cleanup

```bash
dy cleanup
```

此方法是用来删除指定目录的，默认是删除`node_modules`、`dist`、`pnpm-lock.yaml`目录，使用的是`rimraf`库来删除目录。

### update-pkg

```bash
dy update-pkg
```

此方法是用来更新package.json中的依赖版本的，使用的是`ncu`库来更新依赖版本，使用`-d`参数来指定要更新的依赖版本，使用`-u`参数来更新依赖版本，默认是更新所有依赖版本。
