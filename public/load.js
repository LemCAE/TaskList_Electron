let configJson = {};    
const subjectsColor = [
    { prefix: "cn", color: "#ff9900" },
    { prefix: "ma", color: "#0f59a4" },
    { prefix: "en", color: "#1781b5" },
    { prefix: "ph", color: "#fed71a" },
    { prefix: "ch", color: "#8e46af" },
    { prefix: "bi", color: "#1ba784" },
    { prefix: "po", color: "#e74c3c" },
    { prefix: "hi", color: "#fa7e23" },
    { prefix: "ge", color: "#158bb8" },
    { prefix: "sl", color: "#66a9c9" },//自习
    { prefix: "pe", color: "#eea2a4" },//体育
    { prefix: "cm", color: "#ddc871" },//班会
    { prefix: "me", color: "#ed556a" },//心理
    { prefix: "ls", color: "#3498db" },//文体
    { prefix: "ot", color: "#32dbdb" } //其他
];
// 创建并插入 style 标签
const style = document.createElement("style");
document.head.appendChild(style);
// 生成 CSS 规则
subjectsColor.forEach(({ prefix, color }) => {
    const bgColorOpacity31 = `${color}4f`; // 背景色，31% 透明度
    const bgColorOpacity09 = `${color}17`; // 背景色，9% 透明度
    // 添加规则到 style 中
    style.sheet.insertRule(`
    .${prefix} {
        border: 1px solid ${color};
        background-color: ${bgColorOpacity31};
    }
    `);
    style.sheet.insertRule(`
    #${prefix}list {
        border: 1px solid ${color};
        background-color: ${bgColorOpacity09};
    }
    `);
    style.sheet.insertRule(`
    #${prefix}list .listTitle {
        background-color: ${bgColorOpacity31};
        border-right: 1px dashed ${color};
    }
    `);
    style.sheet.insertRule(`
    #${prefix}list .singleLine {
        border-left: 0.25vw solid ${color};
    }
    `);
});
async function loadConfig() {
    configJson = await window.fileAPI.readConfig('config.json');
    // 课程表
    const classTableBox = document.getElementById("classTableBox");
    for (let i = 1; i <= 8; i++) {
        const classDiv = document.createElement("div");
        classDiv.className = "className";
        classDiv.id = `name${i}`;
        const pElement = document.createElement("p");
        pElement.className = "A";
        classDiv.appendChild(pElement);
        classTableBox.appendChild(classDiv);
    }

    //任务列表
    // 科目和对应的 ID
    const subjects = [
    { id: "cnlist", name: "语文" },
    { id: "malist", name: "数学" },
    { id: "enlist", name: "英语" },
    { id: "phlist", name: "物理" },
    { id: "chlist", name: "化学" },
    { id: "bilist", name: "生物" },
    { id: "polist", name: "政治" },
    { id: "hilist", name: "历史" },
    { id: "gelist", name: "地理" },
    { id: "otlist", name: "其他" },
    ];

    const taskList = document.getElementById("taskList");
    const includedPrefixes = configJson.enabledSubject; // ["cn", "ot"]等
    // 循环生成每个科目的 div
    subjects.forEach((subject) => {
        // 获取科目 ID 的前两位字符
        const prefix = subject.id.slice(0, 2); // 获取前两个字符
        // 检查前缀是否在 includedPrefixes 数组中
        if (includedPrefixes.includes(prefix)) {
            const listDiv = document.createElement("div");
            listDiv.id = subject.id;
            listDiv.className = "listinfo";
            const titleDiv = document.createElement("div");
            titleDiv.className = "listTitle";
            const pElement = document.createElement("p");
            pElement.className = "subject-name";
            pElement.textContent = subject.name;
            titleDiv.appendChild(pElement);
            const contentDiv = document.createElement("div");
            contentDiv.className = "listContent";
            listDiv.appendChild(titleDiv);
            listDiv.appendChild(contentDiv);
            taskList.appendChild(listDiv);
        }
    });


    // 编辑任务列表
    // 科目和对应的 ID
    const editSubjects = [
        { id: "editListcn", name: "语文" },
        { id: "editListma", name: "数学" },
        { id: "editListen", name: "英语" },
        { id: "editListph", name: "物理" },
        { id: "editListch", name: "化学" },
        { id: "editListbi", name: "生物" },
        { id: "editListpo", name: "政治" },
        { id: "editListhi", name: "历史" },
        { id: "editListge", name: "地理" },
        { id: "editListot", name: "其他" }
    ];
    // 获取 editListInnerContainer 容器
    const editListContainer = document.querySelector(".editListInnerContainer");
    // 动态生成每个科目的编辑列表
    editSubjects.forEach((subject) => {
        const prefix = subject.id.slice(-2); // 获取后两个字符
        // 检查后缀是否在 includedPrefixes 数组中
        if (includedPrefixes.includes(prefix)) {
            // 创建外层 div
            const editDiv = document.createElement("div");
            editDiv.id = subject.id;
            editDiv.className = "editListinner";
            // 创建标题 div
            const titleDiv = document.createElement("div");
            titleDiv.className = "editListTitle";
            titleDiv.textContent = subject.name;
            // 创建内容 div
            const contentDiv = document.createElement("div");
            contentDiv.className = "editListContent";
            // 创建添加新任务的 div
            const newTaskDiv = document.createElement("div");
            newTaskDiv.className = "createNewTask";
            newTaskDiv.draggable = false;
            newTaskDiv.textContent = "+";
            // 将新任务 div 添加到内容 div 中
            contentDiv.appendChild(newTaskDiv);
            // 将标题和内容 div 添加到外层 div
            editDiv.appendChild(titleDiv);
            editDiv.appendChild(contentDiv);
            // 将外层 div 添加到 editListContainer 中
            editListContainer.appendChild(editDiv);
        };
    });
    function hideTitles(elements, titleSelector) {
        elements.forEach(element => {
            element.style.display = 'none';
            element.parentNode.querySelector(titleSelector).style.borderBottom = 'none';
        });
    }
    hideTitles(document.querySelectorAll(".editListContent"), ".editListTitle");
}
loadConfig();