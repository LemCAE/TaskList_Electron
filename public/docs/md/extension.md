# 拓展功能

## 定时背景音乐

## 随机一言

**随机一言**功能可以在列表中添加一句从文件随机选择的名言，每次保存列表或刷新页面时，都会随机选择一句名言显示。程序自带了文件，如果你将**名言文件**一栏留空，则会使用默认文件。要显示名言，请点击“复制元素”按钮，并将其粘贴至任务列表编辑框中（比如“其他”一栏），并请注意不要重复粘贴。即使有多个元素，程序每次也只会在一处显示名言。

当然，你也可以自定义名言文件，名言文件应使用json格式,其基本结构如下:

```json
{
    "quotes":[
        {
            "main": "The only way to do great work is to love what you do.",
            "translation": "做出伟大工作的唯一方式是热爱你所做的事。",
            "author": "Steve Jobs"
        },         <-- 相邻字段间有逗号
        {
            "main": "The best way to predict the future is to create it.",
            "translation": "预测未来的最佳方式就是创造未来。",
            "author": "Peter Drucker"
        },         <-- 相邻字段间有逗号
        {
            "main":"",
            "translation":"",
            "author":""
        },         <-- 相邻字段间有逗号
        {
            "main":"",
            "translation":"",
            "author":""
        }          <-- 最后一个字段后无逗号
    ]
}
```

其中，**main**为主文，**translation**为另一语言翻译，**author**为作者或来源。**main**为必填项，**translation**和**author**为选填项。

请确保格式正确，并在保存时采用**UTF-8**编码格式否则可能导致无法正常显示甚至程序崩溃。

## 倒计时

## 专注模式

## 小工具

程序内置了几个小工具

### 倒计时

### 随机抽取

### 字体编辑
