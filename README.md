## 基本概念

工作方式
* 对于回调，Node以单线程进程方式运行，因不阻塞主进程而适用于Web应用。
* 回调是传递给程序的程序，后者在前者执行后执行，这也叫单线程事件回环。
* 架构上，Node底层用C++，外层用JavaScript包装，开发者交互不涉及底层。

应用
* REST API
* 实时服务
* 微服务
* 工具

模块
* Node用模块管理代码
* 每个代码文件自成模块
* 用module变量访问当前模块
* 用module.exports导出模块
* 用全局方法requre导入模块

练习 - 模块导入导出
* 查看`1_export.js`和`2_import.js`。
* 运行 
```
$ node 2_import.js
```
* 以下所有样本程序运行方式都如上`node <program_name>`
* 输入`node n`，这里`n`是程序编号，再`tab`自动完成即可。

### 模块类型

* 内建：出厂自带，不须安装或编写
* 三方：不须编写，要从代码库安装
* 本地：开发者在本地自行编写创建

内建模块方法
* assert: 在测试中验证结果与预期
* buffer: 处理二进制数据
* child_process: 运行子进程
* crypto: 处理OpenSSL加密方法
* dns: 处理DNS查询和名称解析
* events: 处理事件
* fs: 处理文件系统操作
* http/https: 创建Web服务器
* stream: 处理数据流
* ntil: 访问工具方法

练习 - 内建模块
* 查看`0_sample.txt`和`3_module_fs.js`。
* 运行
```
$ node 3_module_fs.js
```

三方模块
* Node包管理器（NPM）管理三方模块。
* 安装后即可引用和使用其方法。
* 三方模块默认安装在`node_modules`文件夹中。
* Node从当前目录逐级向上直到系统根目录搜索指定模块。
* 模块结构为`foo/index.js`时，可指定模块名称为`foo`。

练习 - 三方模块
* 安装三方模块
```
$ npm install request
```
* 获取指定网页内容
```
$ node 4_module_req.js
```

### NPM命令

* `npm init`
在项目根目录运行，初始化Node项目，创建`package.json`文件，包含以下设定：
** name: 项目名称
** version: 项目版本
** main: 项目程序入口，main文件
** scripts: 其他键值
** dependencies: 本项目依赖的第三方模块及其版本
** devDependencies: 开发环境依赖的第三方模块，一般用户开发流程自动化

* `npm install`
不带任何参数则安装`package.json`中定义的全部模块，也可指定模块名和参数：
** --save: 安装模块并将模块详情记录到`package.json`
** --save-dev: 安装模块并将模块详情记录到开发模块部分
** --global: 不仅为当前项目，而且为整个系统安装模块
** <package>@<ver>: 安装指定版本的模块，不指定版本号则安装最新版本

* 其他
** `npm list`: 列印已经安装的模块
** `npm uninstall <package>`: 卸载指定的模块
** `npm outdated`: 列出可更新的模块

### 数据格式

如果Node找不到指定的以`.js`为扩展名的模块文件，则会找以`.json`为扩展名的文件。
这是因为Node将JSON(JavaScript Object Notation)作为其默认和首选的数据格式。

## 异步编程

异步编程是一种工作流的设计方法，有回调、约束

### 回调

异步编程通过回调实现，即允许一个方法作为对象被代入另一个方法的执行参数或被返回以延后执行。
以下程序演示普通方法和回调方法实现同一目的的不同方式：
```
const fs = require('fs');
let file = `${__dirname}/0_sample.txt`;

// 一般的方式
fs.readFile(file,  'utf8',  (err, data) => {
    if (err)  throw err;
    console.log(data);
});

// 回调的方式
const callback = (err, data) => {
    if (err) throw err;
    console.log(data);
};

fs.readFile(file, 'utf8', callback);

console.log('Guess when this come out?');
```
从上例看，回调就是在原本放函数的地方放了一个函数对象。有时候，为了增强代码可读性和可维护性，类似操作的初衷并不是为了使用异步编程重新安排程序的执行流程，但却得到了意外的结果。这里保留这个问题不回答，先继续。

如果将以上代码放到一个文件执行，最后打印的语句会出现在两段样本文本中间。因为一般方式打印的第一段样本文本会最先打印出来，接着第二个打印样本文本的语句放入回调，程序向下执行打印最后一条语句，回头执行回调。

### 约束

约束是另一种异步编程方法，在6号样本代码中有如下范例：
```
const fs = require('fs');
const util = require('util');
const promise = util.promisify(fs.readFile);
let file = `${__dirname}/0_sample.txt`;

promise(file, 'utf8')
    .then(data => console.log(data))
    .catch(error => console.log('err: ', error));
```
这里用`util.promisify()`方法将`readFile()`函数转换为约束函数，使用`then`和`catch`分别处理正常和异常情况，在代码可读性和维护性上有所改进。

另外，7号范例使用`Promise.all()`演示约束函数的并行处理功能：
```
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

const files = [
    `0_sample.txt`,
    `0_sample.txt`,
    `0_sample.txt`
];

const promises = files.map(file => 
    readFile(`${__dirname}/${file}`, 'utf8'));

Promise.all(promises)
    .then(data => {data.forEach(text => console.log(text))})
    .catch(error => console.log('err: ', error));
```

以上范例中：
* `readFile`是一个从`fs.readFile`创建的约束函数
* `files`是一个包含三个文本文件的数组
* `promises`是一个包含三个约束函数的数组
* `Promise.all()`读入约束函数数组，返回约束函数结果数组

### Async/Await

在8号样本中的异步编程方式最好，形式上也更近似与同步编程：
```
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
let file = `${__dirname}/0_sample.txt`;

async function readFiles() {
    const content1 = await readFile(file);
    const content2 = await readFile(file);
    const content3 = await readFile(file);

    return 'Content 1\n' + content1 + '\n\nContent 2 \n' 
        + content2 + '\n\nContent 3' + content3;
}

readFiles().then(result => console.log(result));
```