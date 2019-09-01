# Start API Development with Node.js

一个关于API和Node.js的小培训，编程语言当然是JavaScript，适合初学者。

## 基本概念

#### 工作方式
* 对于回调，Node以单线程进程方式运行，因不阻塞主进程而适用于Web应用。
* 回调是传递给程序的程序，后者在前者执行后执行，这也叫单线程事件回环。
* 架构上，Node底层用C++，外层用JavaScript包装，开发者交互不涉及底层。

#### 应用
* REST API
* 实时服务
* 微服务
* 工具

## 模块

* Node用模块管理代码
* 每个代码文件自成模块
* 用module变量访问当前模块
* 用module.exports导出模块
* 用全局方法requre导入模块

#### 练习 - 模块导入导出
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

#### 内建模块方法
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

#### 练习 - 内建模块
* 查看`0_sample.txt`和`3_module_fs.js`。
* 运行
```
$ node 3_module_fs.js
```

#### 三方模块
* Node包管理器（NPM）管理三方模块。
* 安装后即可引用和使用其方法。
* 三方模块默认安装在`node_modules`文件夹中。
* Node从当前目录逐级向上直到系统根目录搜索指定模块。
* 模块结构为`foo/index.js`时，可指定模块名称为`foo`。

#### 练习 - 三方模块
* 安装三方模块
```
$ npm install request
```
* 获取指定网页内容
```
$ node 4_module_req.js
```

### NPM命令

#### `npm init`
在项目根目录运行，初始化Node项目，创建`package.json`文件，包含以下设定：
* name: 项目名称
* version: 项目版本
* main: 项目程序入口，main文件
* scripts: 其他键值
* dependencies: 本项目依赖的第三方模块及其版本
* devDependencies: 开发环境依赖的第三方模块，一般用户开发流程自动化

#### `npm install`
不带任何参数则安装`package.json`中定义的全部模块，也可指定模块名和参数：
* --save: 安装模块并将模块详情记录到`package.json`
* --save-dev: 安装模块并将模块详情记录到开发模块部分
* --global: 不仅为当前项目，而且为整个系统安装模块
* <package>@<ver>: 安装指定版本的模块，不指定版本号则安装最新版本

#### 其他
* `npm list`: 列印已经安装的模块
* `npm uninstall <package>`: 卸载指定的模块
* `npm outdated`: 列出可更新的模块

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

#### 一般约束
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

#### 同步约束
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

## 创建API

### TODO列表

* 使用Node.js内建http模块配置Web服务器
* 为API配置Hapi.js
* 了解HTTP基本请求类型及其区别
* 实施HTTP请求，创建多种方式的API路由
* 为Web应用程序配置日志

### Web服务器

使用Node.js内建的http模块创建Web服务器：
```
const http = require('http');
const server = http.createServer((request, response) => {
    console.log('Request starting...');
    response.write('Hello World!');
    response.end();
});

server.listen(5000, () => 
    console.log('Server running at http://localhost:5000'));
```

运行服务器并导航到本地回环地址的5000端口确认结果：
```
$ node 9_http_server.js
Server running at http://localhost:5000
Request starting...
```

### Hapi服务器

这部分要完成如下任务：
* 创建Hapi.js服务器
* 使用API客户端
* 返回JSON字符串
* 优化开发流程
* 设置和启用日志

Hapi是HTTP API的缩写，是为API应用优化的HTTP服务器。
首先生成`package.json`文件：
```
$ npm init -y
```
接着安装Hapi模块并保存到依赖记录：
```
$ npm install hapi --save
```
最后写出服务器程序：
```
const Hapi = require('hapi');
const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    server.route({
        method: 'GET',
        path:'/',
        handler: (request, h) => {
            return { message: 'Hello World!'};
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
```

注意：
* 以上程序中使用的`async/await`方式启动Hapi服务器
* 如果没有`server.route`的主页路由会得到`404`错误
* 主页路由返回的是一个REST API常用的JSON类型数据
* 如用迭代开发方法，创建路由和返回JSON前可运行测试

#### Nodemon流程
为简化迭代开发流程，避免每次修改服务器程序代码后重启：
```
$ sudo npm install --global nodemon
$ nodemon 10_hapi_server.js
[nodemon] 1.19.1
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: *.*
[nodemon] starting `node 10_hapi_server.js`
Server running on http://localhost:3000
[nodemon] restarting due to changes...
[nodemon] starting `node 10_hapi_server.js`
Server running on http://localhost:3000
```
如上，每次修改服务器代码后`node`会自动重新运行程序。

#### Good日志
为排错或监视程序后台运行状况，配置`Hapi`日志扩展程序：
```
$ npm install good good-console --save
```

更新服务器程序，在服务器启动命令前添加如下代码：
```
...
   const options = {
        ops: {
            interval: 100000
        },
        reporters: {
            consoleReporters: [
                { module: 'good-console' },
                'stdout'
            ]
        }
    };

    await server.register({
        plugin: require('good'),
        options
    });

    await server.start();
...
```

重启Hapi服务器，访问主页或服务器程序更新有日志：
```
[nodemon] restarting due to changes...
[nodemon] starting `node 10_hapi_server.js`
Server running on http://localhost:3000
190828/005830.910, (1566953910910:user-asus:7516:jzujw9sm:10000)
[response] http://localhost:3000: get / {} 200 (34ms)
```

另外，即便没有即时日志，也会有定期更新的状态日志。

#### Insomnia客户端
作为测试API的客户端，可选Insomnia或者Postman。
如果选Insomnia且使用Ubuntu系统，可从软件中心下载。

### HTTP请求和方法

将介绍如何完成以下任务：
* 获取一个资源列表
* 获取一个指定资源
* POST方法创建任务
* PUT方法全更新资源
* PATCH方法局部更新
* DELETE方法删除
* 请求验证

HTTP请求方法
* 请求目标路由即API的URI地址
* GET方法获取资源数据
* POST方法提交指定资源
* PUT方法完整更新已有资源
* PATCH方法更新部分资源
* DELETE方法删除资源

#### 创建资源文件
为配合本部分演示：
```
const todoList = [
    {
        title: 'Shopping',
        dateCreated: 'Jan 21, 2018',
        list: [
            { text: 'Node.js Books', done: false },
            { text: 'MacBook', done: false },
            { text: 'Shoes', done: true}
        ]
    },
    {
        title: 'Places to visit',
        dateCreated: 'Feb 12, 2018',
        list: [
            { text: 'Nairobi, Kenya', done: false },
            { text: 'Moscow, Russia', done: false }
        ]
    }
];

module.exports = [
    {
        method: 'GET',
        path: '/todo',
        handler: (request, h) => {
            return todoList;
        }
    },
    {
        method: 'GET',
        path: '/todo/{id}',
        handler: (request, h) => {
            const id = request.params.id - 1;
            if (todoList[id]) return todoList[id];
            return h.response({message: 'Not Found'}).code(404);
        }
    },
    {
        method: 'POST',
        path: '/todo',
        handler: (request, h) => {
            const  todo = request.payload;
            todoList.push(todo);
            return h.response({message: 'Created'});
        }
    },
    {
        method: 'PUT',
        path: '/todo/{id}',
        handler: (request, h) => {
            const  id = request.params.id - 1;
            todoList[id] = request.payload;
            return h.response({message: 'Updated'});
        }
    },
    {
        method: 'PATCH',
        path: '/todo/{id}',
        handler: (request, h) => {
            const  id = request.params.id - 1;
            const todo = todoList[id];
            Object.keys(request.payload).forEach ( key => {
                if (key in todo) {
                    todo[key] = request.payload[key];
                }
            });
            return h.response( { message: "Patched" });
        }
    },
    {
        method: 'DELETE',
        path: '/todo/{id}',
        handler: (request, h) => {
            const  id = request.params.id - 1;
            delete todoList[id];
            return h.response({message: 'Deleted'});
        }
    }
]
```

#### 更新Hapi服务器
引用资源并配置路由：
```
const Hapi = require('hapi');
// 更新添加如下两条语句，引用资源
const routes ={};
routes.todo = require('./0_todo');

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    server.route({
        method: 'GET',
        path:'/',
        handler: (request, h) => {
            return { message: 'Hello World!'};
        }
    });
    // 添加如下一条语句，配置路由
    server.route(routes.todo);
    ...
```

注意：
* 资源文件与Hapi服务器文件在同一文件夹
* 从引用语句可猜到资源文件名`0_todo.js`
* 新增路由配置在根路由之后

#### 获取全部资源
重启Hapi服务器，用API客户端GET方法访问：
http://localhost:3000/todo
确认可以在响应中拿到资源中定义的任务列表：
```
[
  {
    "title": "Shopping",
    "dateCreated": "Jan 21, 2018",
    "list": [
      {
        "text": "Node.js Books",
        "done": false
      },
      {
        "text": "MacBook",
        "done": false
      },
      {
        "text": "Shoes",
        "done": true
      }
    ]
  },
  {
    "title": "Places to visit",
    "dateCreated": "Feb 12, 2018",
    "list": [
      {
        "text": "Nairobi, Kenya",
        "done": false
      },
      {
        "text": "Moscow, Russia",
        "done": false
      }
    ]
  }
]
```

#### 获取指定资源
用API客户端GET方法访问：
http://localhost:3000/todo/1
确认可以在响应中拿到资源中的指定任务：
```
{
  "title": "Shopping",
  "dateCreated": "Jan 21, 2018",
  "list": [
    {
      "text": "Node.js Books",
      "done": false
    },
    {
      "text": "MacBook",
      "done": false
    },
    {
      "text": "Shoes",
      "done": true
    }
  ]
}
```

#### 添加资源
用API客户端POST方法访问：
http://localhost:3000/todo
选择请求体类型为JSON，编辑如下内容：
```
{
	"title": "Language to learn",
	"dateCreated": "9 April 2018",
	"list": ["Italian", "Spanish"]
}
```
发送请求，确认得到如下响应：
```
{
  "message": "Created"
}
```
使用获取全部资源或指定资源的方法确认结果。

#### 全部更新
用API客户端PUT方法访问：
http://localhost:3000/todo/3
选择请求体类型为JSON，编辑如下内容：
```
{
	"title": "Language to learn",
	"dateCreated": "9 April 2018",
	"list": ["Italian", "Spanish", "Japanese"]
}
```
以上请求仅更新语言列表，但需要传递完整资源记录。
发送请求，确认得到如下响应：
```
{
  "message": "Updated"
}
```
使用获取全部资源或指定资源的方法确认结果。

#### 局部更新
用API客户端PATCH方法访问：
http://localhost:3000/todo/3
选择请求体类型为JSON，编辑如下内容：
```
{
	"title": "Language learned",
	"list": ["Italian", "Spanish"]
}
```
以上请求更新标题和语言列表，不需传递冗余信息。
发送请求，确认得到如下响应：
```
{
  "message": "Patched"
}
```
使用获取全部资源或指定资源的方法确认结果。

#### 删除资源
用API客户端Delete方法访问：
http://localhost:3000/todo/3
发送请求，确认得到如下响应：
```
{
  "message": "Deleted"
}
```
使用获取全部资源的GET方法，确认删除结果。

## 改进API

之前创建的API过于简单，没有数据库支持而无法长期保存数据，没有认证而可以被任何人访问，缺少测试模块。为改进API，这里使用Knex连接数据库并设计相应路由，使用JWT实现API认证，使用Lab添加测试功能。

### 安装和配置MySQL服务器

#### 安装
安装程序，确认服务器运行状态，配置安全选项：
```
$ sudo apt update
$ sudo apt install mysql-server
$ sudo systemctl status mysql
$ sudo mysql_secure_installation
```

配置root用户使用密码登录，创建管理员用户：
```
$ sudo mysql
mysql> SELECT user,authentication_string,plugin,host FROM mysql.user;
mysql> ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'P@ssw0rd';
mysql> FLUSH PRIVILEGES;
mysql> SELECT user,authentication_string,plugin,host FROM mysql.user;
mysql> CREATE USER 'admin'@'localhost' IDENTIFIED BY 'P@ssw0rd';
mysql> GRANT ALL PRIVILEGES ON *.* TO 'admin'@'localhost' WITH GRANT OPTION;
mysql> exit
```

确认数据库管理工具可用，尝试停止和启动服务：
```
$ sudo mysqladmin -p -u root version
$ sudo systemctl stop mysql
$ sudo systemctl start mysql
```

#### 配置
虽然也可以通过命令行操作，这里选择`MySQL Workbench`的GUI界面。
安装完成并运行，控制台自动检测到本地安装的数据库服务器，连接并运行：
```
CREATE DATABASE todo;

USE todo;

CREATE TABLE user(
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(50),
  `email` VARCHAR(100),
  `password` VARCHAR(200)
);

CREATE TABLE todo(
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(50),
  `date_created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `user_id` INT,
  FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
);

CREATE TABLE todo_item(
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `text` VARCHAR(50),
  `done` BOOLEAN,
  `date_created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `todo_id` INT,
  FOREIGN KEY (`todo_id`) REFERENCES `todo` (`id`) ON DELETE CASCADE
);
```
以上操作创建了`todo`数据库，在其中创建了`user`，`todo`和`todo_item`表格。

创建数据库配置文件`db.js`：
```
const env = process.env.NODE_ENV || 'development';

const configs = {
  development: {
    client: 'mysql',
    connection: {
      host: 'localhost',
      user: 'root',
      password: 'P@ssw0rd',
      database: 'todo',
      charset: 'utf8',
    },
  }
};
const Knex = require('knex')(configs[env]);

module.exports = Knex;
```
注意更新以上代码中的密码设置为实际的配置，`P@ssw0rd`只应该作占位符。

创建数据库连接测试文件`test_db.js`：
```
const Knex = require('./db');

Knex.raw('select 1+1 as sum')
  .catch((err) => console.log(err.message))
  .then(([res]) => console.log('connected: ', res[0].sum));
```
运行并确认结果：
```
$ node test_db.js
connected:  2
```

通过`MySQL Workbench`创建两个测试用户：
```
USE todo;

INSERT INTO `user` (`id`, `name`, `email`, `password`)
VALUE (NULL, 'Test User', 'user@example.com', MD5('P@ssw0rd'));
INSERT INTO `user` (`id`, `name`, `email`, `password`)
VALUE (NULL, 'Test User1', 'user1@example.com', MD5('P@ssw0rd'));
```

从现在开始将创建新的项目并使用数据库长久保存，更新`todo.js`如下：
* 清除之前创建的样本数据`todoList`
* 在头部添加`const Knex = require('./db')`

更新并创建POST方法，

用于发布新的TODO记录及其内容：
```
    {
        method: 'POST',
        path: '/todo',
        handler: async (request, h) => {
            const  todo = request.payload;
            todo.user_id = 1;
            const [todoId] = await Knex('todo').returning('id').insert(todo);
            return h.response({message: 'Created',  todo_id: todoId });
        }
    },
    {
        method: 'POST',
        path: '/todo/{id}/item',
        handler: async (request, h) => {
            const  todoItem = request.payload;
            todoItem.todo_id = request.params.id;
            const [id] = await Knex('todo_item').returning('id').insert(todoItem);
            return h.response({message: 'Created',  id: id });
        }
    },
```

更新并创建GET方法，用户获取全部或个别TODO记录，或某个记录的详情：
```
   {
        method: 'GET',
        path: '/todo',
        handler: async (request, h) => {
            const userId = 1;
            const todos = await  Knex('todo').where('user_id', userId);
            return h.response(todos);
        }
    },
    {
        method: 'GET',
        path: '/todo/{id}',
        handler: async (request, h) => {
            const id = request.params.id;
            const userId = 1;
            const [todo] = await  Knex('todo').where({id: id, user_id: userId});
            if (todo) return h.response(todo);
            return h.response({message: 'Not found'}).code(404);
        }
    },
    {
        method: 'GET',
        path: '/todo/{id}/item',
        handler: async (request, h) => {
            const todoId = request.params.id;
            const items = await Knex('todo_item').where('todo_id', todoId);
            return h.response(items);
        }
    },
```

更新并创建PATCH方法，用于更新某个TODO记录的标题或内容：
```
    {
        method: 'PATCH',
        path: '/todo/{id}',
        handler: async (request, h) => {
            const  todoId = request.params.id;
            const title = request.payload.title;
            const patched = await Knex('todo').update({title: title}).where('id', todoId);
            return h.response( { message: "Patched", patched: patched });
        }
    },
    {
        method: 'PATCH',
        path: '/todo/{todo_id}/item/{id}',
        handler: async (request, h) => {
            const  itemId = request.params.id;
            const item = request.payload;
            const patched = await Knex('todo_item').update(item).where('id', itemId);
            return h.response( { message: "Patched", patched: patched });
        }
    },
```

更新并创建DELETE方法，用于删除个别TODO记录或其中个别项目：
```
    {
        method: 'DELETE',
        path: '/todo/{id}',
        handler: async (request, h) => {
            const  id = request.params.id;
            const deleted = await Knex('todo').where('id', id).delete();
            return h.response({message: 'Deleted', deleted: deleted});
        }
    },
    {
        method: 'DELETE',
        path: '/todo/{todo_id}/item/{id}',
        handler: async (request, h) => {
            const  id = request.params.id;
            const deleted = await Knex('todo_item').where('id', id).delete();
            return h.response({message: 'Deleted', deleted: deleted});
        }
    }
```

#### 清理路由
经过以上设置，方法PUT已经不会用到，可直接移除。另外，通过`Joi`模块验证提交的内容，更新`todo.js`：
```
const Knex = require('./12_db');
const Joi = require('joi');
....
{
        method: 'POST',
        path: '/todo',
        handler: async (request, h) => {
            const  todo = request.payload;
            todo.user_id = 1;
            const [todoId] = await Knex('todo').returning('id').insert(todo);
            return h.response({message: 'Created',  todo_id: todoId });
        },
        config: {
            validate: {
                payload: {
                    title: Joi.string().required()
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/todo/{id}/item',
        handler: async (request, h) => {
            const  todoItem = request.payload;
            todoItem.todo_id = request.params.id;
            const [id] = await Knex('todo_item').returning('id').insert(todoItem);
            return h.response({message: 'Created',  id: id });
        },
        config: {
            validate: {
                payload: {
                    text: Joi.string().required()
                }
            }
        }
    },
...
    {
        method: 'PATCH',
        path: '/todo/{id}',
        handler: async (request, h) => {
            const  todoId = request.params.id;
            const title = request.payload.title;
            const patched = await Knex('todo').update({title: title}).where('id', todoId);
            return h.response( { message: "Patched", patched: patched });
        },
        config: {
            validate: {
                payload: {
                    title: Joi.string().required()
                }
            }
        }
    },
    {
        method: 'PATCH',
        path: '/todo/{todo_id}/item/{id}',
        handler: async (request, h) => {
            const  itemId = request.params.id;
            const item = request.payload;
            const patched = await Knex('todo_item').update(item).where('id', itemId);
            return h.response( { message: "Patched", patched: patched });
        },
        config: {
            validate: {
                payload: {
                    text: Joi.string().required(),
                    done: Joi.boolean()
                }
            }
        }
    },
....
```

验证配置，如果提交的内容在字段名和内容类型上不匹配，会得到如下错误：
```
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Invalid request payload input"
}
```

另外，虽然这里好像不用单独安装`Joi`模块也不会报错，但之后在JWT应该是作为内建模块加载了。

### JWT认证

发布生产的API不可能没有认证机和授权机制，这里添加基于JSON Web Tokens的认证功能。用户在API请求信息的头部添加JWT认证令牌，用`Bearer`标识。为此，安装JWT和MD5模块：
```
$ npm install jsonwebtoken md5 --save
```

创建JWT认证模块配置文件：
```
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const md5 = require('md5');
const Knex = require('./db');

module.exports = {
    method: 'POST',
    path: '/auth',
    handler: async (request, h) => {
        const { email, password } = request.payload;
        const [user] = await Knex('user').where({email: email});

        if(!user) {
            return h.response({message: 'user not found'}).code(404);
        }

        if (user.password == md5(password)) {
            const token = jwt.sign(
                {
                    name: user.name,
                    emal: user.email,
                    id: user.id
                },
                'secretkey-hash',
                {
                    algorithm: 'HS256',
                    expiresIn: '120d'
                }
            );
            return h.response({token: token, uid: user.uid});
        }
        return h.response({message: 'incorrect password'}).code(400);
    },
    config: {
        validate: {
            payload: {
                email: Joi.string().email().required(),
                password: Joi.string().required()
            }
        }
    }
}
```

以上认证配置和模块导出文件做了如下设置：
* 指定访问路径和方法，请求处理方法和数据验证
* 从请求体解析得到邮箱和密码，从邮箱查找用户
* 找不到用户则返回错误提示，密码错误时也提示
* 根据查询到的用户信息生成认证令牌并将其返回

更新服务器配置`server.js`，启用JWT认证：
```
const Hapi = require('hapi');
const Knex = require('./12_db');

const routes ={};
routes.todo = require('./0_todo');
routes.auth = require('./14_auth');

// 验证令牌中拿到的邮箱信息，作为用户唯一标识，有效
const validate = async function (decoded, request) {
    // 以下控制台日志用于调试，确认令牌解析结果中的邮箱信息正确
    // console.log(decoded.email);
    const [user] = await Knex('user').where({email: decoded.email});
    // 以下日志语句用于调试，确认拿到的用户信息完整且准确
    // console.log([user]);
    if (![user]) { return { isValid: false }; }
    else { return { isValid: true }; }
};

const init = async () => {

    const server = new Hapi.server({ port: 8000 });

    // 引用为Hapi启用JWT支持的模块，需要先NPM安装
    await server.register(require('hapi-auth-jwt2'));

    server.auth.strategy('token', 'jwt', {
        key: 'secretkey-hash',  // 可以使用更强密钥，注意auth文件同步修改
        validate: validate,  // 调用之前独立定义的验证函数
        verifyOptions: { algorithms: [ 'HS256' ] }
    });

    // 定义路由
    // 根页面
    server.route({
        method: 'GET',
        path:'/',
        config: { auth: 'token' }, // 配置为`false`可关闭根页面的JWT认证
        handler: (request, h) => {
            return h.response({ message: 'Hello World!'});
        }
    });
    // JWT令牌获取页面，需要关闭JWT认证
    server.route(routes.auth);
    // todo页面的批量认证设置
    const authRoutes = routes.todo.map(route => {
        route.config = { auth: 'token' }; // 配置为`false`可关闭所有todo页面的JWT认证
        return route;
    });
    server.route(authRoutes);

    // 启用日志
    await server.register({
        plugin: require('good'),
        options: {
            ops: {
                interval: 1000000
            },
            reporters: {
                consoleReporters: [
                    { module: 'good-console' },
                    'stdout'
                ]
            }
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
```

#### 验证
生成JWT令牌，在Insomnia访问`http://<server_url>/auth`用POST发送JSON请求体：
```
{
	"email": "user@example.com",
	"password": "P@ssw0rd"
}
```
如果在`MySQL Workbench`配置了如上用户会得到令牌，如果用户名或密码错误会得到相应的错误提示。

复制生成的令牌，在Insomnia用GET方法访问以下地址，或逐一验证todo的所有路由：
* http://<server_url>/
* http://<server_url>/todo
应该可以看到根页面欢迎词和TODO事项列表，其他深入测试和反向试错测试请自便。

#### 优化
之前`todo.js`路由设置使用硬编码的用户ID，现在启用认证后可以使用认证信息中的用户ID：
```
    {
        method: 'GET',
        path: '/todo',
        handler: async (request, h) => {
            // 不再使用硬编码的用户ID，而是从请求的认证信息中动态获取
            // const userId = 1;
            const userId = request.auth.credentials.id;

            const todos = await  Knex('todo').where('user_id', userId);
            return h.response(todos);
        }
    },
```
以上类似修改同样实施到其他涉及用户ID的todo路由设置，这里不赘述。完成后手动测试确认。

接着，需要限制用户只能访问由其创建的TODO项目，为此再次更新`todo.js`路由设置：
```
    {
        method: 'GET',
        path: '/todo/{id}/item',
        handler: async (request, h) => {
            const todoId = request.params.id;

            // 增加以下一节代码，确认只有用户自己可以查看所属的TODO事项详情
            const userId = request.auth.credentials.id;
            const [todo] = await Knex('todo').where({ id: todoId, user_id: userId });
            if (!todo) {
                return h.response({ message: 'Not authorized' }).code(401);
            }

            const items = await Knex('todo_item').where('todo_id', todoId);
            return h.response(items);
        }
    },
```
以上增加的代码段也可以同样实施到其他合适的路由，这里不赘述。为进一步验证访问限制功能有效，重复之前创建用户和发布TODO项目的步骤，使用用户`Test User1`创建项目，手动反向测试确认非所有者用户无法查看他人TODO项目。


### 单元测试

测试对代码维护、确认需求和开发流程都有益，这里添加基本测试功能，先安装所需模块：
```
$ npm install gulp gulp-shell gulp-watch lab --save-dev
```

更新`db.js`，为测试环境作配置，在`const configs`和`const Knex`之间添加命令：
```
...
const configs = {
  development: {
    ...
  }
};
// 添加如下一行设置，即测试使用开发配置
configs.test = configs.development;
const Knex = require('knex')(configs[env]);
...
```

更新`server.js`，调整端口和主页认证配置：
```
```

创建`test_todo.js`测试文件：
```
const assert = require('assert');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const server = require('./server');

const {
  experiment,
  test,
  before,
} = lab;

experiment('Base API', () => {
  test('GET: /', () => {
    const options = {
      method: 'GET',
      url: '/',
    };
    server.inject(options, (response) => {
      assert.equal(response.statusCode, 200);
      assert.equal(response.result.message, 'hello, world');
    });
  });
});
```

运行测试，确认可以通过：
```
$ PORT=8080 ./node_modules/lab/bin/lab test_todo.js --leaks
...
1 tests complete
Test duration: 241 ms
```

修改`package.json`文件，添加自动测试脚本：
```
  "scripts": {
    "test": "PORT=8080 ./node_modules/lab/bin/lab test_todo.js --leaks"
  },
```

更新`test_todo.js`测试文件，添加测试项验证无认证时的访问结果：
```
experiment('Authentication', () => {
  test('GET: /todo without auth', () => {
    const options = {
      method: 'GET',
      url: '/todo'
    };
    server.inject(options, (response) => {
      assert.equal(response.statusCode, 401);
    });
  });
});
```

运行测试：
```
$ npm test
...
2 tests complete
Test duration: 298 ms
```

使用Gulp模块创建`gulpfile.js`为API客户端提供自动测试功能：
```
const gulp = require('gulp');
const shell = require('gulp-shell');
const watch = require('gulp-watch');

const src = [
  './auth.js',
  './todo.js',
  './test_todo.js',
  './db.js',
  './server.js',
];

gulp.task('test:dev', () => {
  watch(src, () => gulp.run('test'));
});

gulp.task('test', shell.task('npm test'));
```

再次更新`package.json`，追加基于Gulp的测试脚本：
```
  "scripts": {
    "test": "PORT=8080 ./node_modules/lab/bin/lab 15_test_todo.js --leaks",
    // 追加以下一行脚本使用Gulp发起自动测试
    "test:dev": "./node_modules/.bin/gulp test:dev"
  },
```

运行自动测试命令，遇到以下问题，没有排除：
```
$ npm run test:dev
> create-API-with-NodeJS@1.0.0 test:dev /home/user/Workspace/create-API-with-NodeJS
> gulp test:dev
[20:00:36] Using gulpfile ~/Workspace/create-API-with-NodeJS/gulpfile.js
[20:00:36] Starting 'test:dev'...
(node:10848) UnhandledPromiseRejectionWarning: TypeError: gulp.run is not a function
    at watch (/home/user/Workspace/create-API-with-NodeJS/gulpfile.js:14:25)
    at write (/home/user/Workspace/create-API-with-NodeJS/node_modules/gulp-watch/index.js:148:3)
    at /home/user/Workspace/create-API-with-NodeJS/node_modules/gulp-watch/index.js:131:5
(node:10848) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 1)
(node:10848) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
```

更新`test_todo.js`，添加最后一段测试带JWT认证的访问：
```
experiment('/todo/* routes', () => {
  const headers = {
    Authorization: 'Bearer ',
  };
  before(() => {
    const options = {
      method: 'POST',
      url: '/auth',
      payload: {
        email: 'user@example.com',
        password: 'P@ssw0rd',
      },
    };
    return new Promise((done) => {
      server.inject(options, (response) => {
        headers.Authorization += response.result.token;
        done();
      });
    });
  });

  test('GET: /todo', () => {
    const options = {
      method: 'GET',
      url: '/todo',
      headers: headers,
    };
    return new Promise((done) => {
      server.inject(options, (response) => {
        assert.equal(Array.isArray(response.result), true);
        assert.equal(response.statusCode, 200);
        done();
      });
    }).catch(error => { throw error});
  });
});
```

运行测试：
```
$ npm test
> create-API-with-NodeJS@1.0.0 test /home/user/Workspace/create-API-with-NodeJS
> PORT=8080 ./node_modules/lab/bin/lab 15_test_todo.js --leaks
..[response] http://user-asus:8080: get / {} 200 (41ms)
..[response] http://user-asus:8080: get /todo {} 401 (16ms)
..[response] http://user-asus:8080: post /auth {} 200 (254ms)
```

虽然没有得到类似`3 tests complete`的明确提示，但从以上结果和反向测试可以确认测试已经通过。比起这个小问题，更大的问题是Gulp模块没能顺利启用，测试不会因为监视文件的更新而自动触发。这是由于相关模块更新和过往方法（gulp.run）被停用而造成，目前还没有找到解决办法。
