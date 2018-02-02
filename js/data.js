/*菜单类型*/
var menuList =  {
    'floderMenu': [
        {
            'name': '打开(O)',
            'click': function(ev) {
                var ul = getParentElByAttrAndVal(this, 'tagName', 'UL', true);
                var id = this.getAttribute('_id');
                if (ul == desk) {
                    getExplorer(id);
                } else{
                    ul.setAttribute('_id', id);
                    render(ul, id);
                }
            }
        },
        {
            'name': '新窗口打开(E)',
            'click': function(ev) {
                getExplorer(this.getAttribute('_id'));
            }
        },
        {
            'name': 'split',
            'icon': ''
        },
        {
            'name': '剪切(T)',
            'icon': '',
            'click': cutFile
        },
        {
            'name': '复制(C)',
            'icon': '',
            'click': repeatFile
        },
        {
            'name': 'split',
            'icon': ''
        },
       /* {
            'name': '创建快捷方式(S)',
            'icon': ''
        },*/
        {
            'name': '删除(D)',
            'icon': '',
            'click': deleteFile
        },
        {
            'name': '重命名(M)',
            'icon': '',
            'click': reviseFileName
        },
        {
            'name': 'split',
            'icon': ''
        },
        {
            'name': '属性(R)',
            'icon': '',
            'click': function() {
                getAttrPop(this.getAttribute('_id'));
            }
        }
    ],
    'fileMenu': [
        {
            'name': '打开(O)',
            'icon': '',
            'click': function() {
                var id = this.getAttribute('_id');
                var obj = getObjById(fileList, id);
                if (obj.type == 'video') {
                    getVideoPlayer(id);
                } else if (obj.type == 'audio') {
                    getAudioPlayer(id);
                } else {
                    getFileWindow();
                }
            }
        },
        {
            'name': 'split',
            'icon': ''
        },
        {
            'name': '剪切(T)',
            'icon': '',
            'click': cutFile
        },
        {
            'name': '复制(C)',
            'icon': '',
            'click': repeatFile
        },
        {
            'name': 'split',
            'icon': ''
        },
        /*{
            'name': '创建快捷方式(S)',
            'icon': ''
        },*/
        {
            'name': '删除(D)',
            'icon': '',
            'click': deleteFile
        },
        {
            'name': '重命名(M)',
            'icon': '',
            'click': reviseFileName
        },
        {
            'name': 'split',
            'icon': ''
        },
        {
            'name': '属性(R)',
            'icon': '',
            'click': function() {
                getAttrPop(this.getAttribute('_id'));
            }
        }
    ],
    'fileTrashMenu': [
        {
            'name': '还原',
            'icon': '',
            'click': restoreFile
        },
        {
            'name': 'split',
            'icon': ''
        },
        {
            'name': '剪切(T)',
            'icon': '',
            'click': cutFile
        },
        {
            'name': 'split',
            'icon': ''
        },
        {
            'name': '删除(D)',
            'icon': '',
            'click': clearFile
        },
        {
            'name': 'split',
            'icon': ''
        },
        {
            'name': '属性(R)',
            'icon': '',
            'click': function() {
                getAttrPop(this.getAttribute('_id'));
            }
        }
    ],
    'windowMenu': [
        {
            'name': '查看(V)',
            'icon': '',
            'children': [
                {
                    'name': '大图标(R)',
                    'icon': ''
                },
                {
                    'name': '中等图标(M)',
                    'icon': ''
                },
                {
                    'name': '小图标(N)',
                    'icon': ''
                },
                {
                    'name': '列表(L)',
                    'icon': ''
                },
                {
                    'name': '详细信息(D)',
                    'icon': ''
                },
                {
                    'name': '平铺(S)',
                    'icon': ''
                },
                {
                    'name': '内容(T)',
                    'icon': ''
                }
            ]
        },
        {
            'name': '排序方式(O)',
            'icon': '',
            'children': [
                {
                    'name': '名称',
                    'icon': ''
                },
                {
                    'name': '类型',
                    'icon': ''
                },
                {
                    'name': 'split'
                },
                {
                    'name': '递增(A)'
                },
                {
                    'name': '递减(D)'
                }
            ]
        },
        {
            'name': '刷新(E)',
            'icon': '',
            'click': refresh
        },
        {
            'name': 'split',
            'icon': '',
        },
        {
            'name': '粘贴(P)',
            'icon': '',
            'click': pasteFile,
            'disable': true
        },
        /*{
            'name': '粘贴快捷方式(S)',
            'icon': '',
            'disable': true
        },*/
        {
            'name': '<label class="upload">文件上传<input type="file"></label>',
            'icon': '',
            'click': uploadFile
        },
        {
            'name': 'split',
            'icon': '',
        },
        {
            'name': '新建(W)',
            'icon': '',
            'children': [
                {
                    'name': '文件夹',
                    'icon': 'icon-i1',
                    'clickInfo': {
                        'type': 'floder'
                    },
                    'click': createFile
                },
                {
                    'name': 'Microsoft Word文档',
                    'icon': 'icon-i4',
                    'clickInfo': {
                        'type': 'word'
                    },
                    'click': createFile
                },
                {
                    'name': 'Microsoft PowerPoint 幻灯片',
                    'icon': 'icon-i5',
                    'clickInfo': {
                        'type': 'ppt'
                    },
                    'click': createFile
                },
                {
                    'name': '文本文档',
                    'icon': 'icon-i6',
                    'clickInfo': {
                        'type': 'text'
                    },
                    'click': createFile
                },
                {
                    'name': 'Microsoft Excel 工作表',
                    'icon': 'icon-i7',
                    'clickInfo': {
                        'type': 'excel'
                    },
                    'click': createFile
                },
                {
                    'name': 'zip文件',
                    'icon': 'icon-i8',
                    'clickInfo': {
                        'type': 'zip'
                    },
                    'click': createFile
                }
            ]
        },
        {
            'name': 'split',
            'icon': ''
        },
        {
            'name': '属性(R)',
            'icon': '',
            'click': function() {
                getAttrPop(this.getAttribute('_id'));
            }
        }
    ],
    'windowTrashMenu': [
        {
            'name': '查看(V)',
            'icon': '',
            'children': [
                {
                    'name': '大图标(R)',
                    'icon': ''
                },
                {
                    'name': '中等图标(M)',
                    'icon': ''
                },
                {
                    'name': '小图标(N)',
                    'icon': ''
                },
                {
                    'name': '列表(L)',
                    'icon': ''
                },
                {
                    'name': '详细信息(D)',
                    'icon': ''
                },
                {
                    'name': '平铺(S)',
                    'icon': ''
                },
                {
                    'name': '内容(T)',
                    'icon': ''
                }
            ]
        },
        {
            'name': '排序方式(O)',
            'icon': '',
            'children': [
                {
                    'name': '名称',
                    'icon': ''
                },
                {
                    'name': '类型',
                    'icon': ''
                },
                {
                    'name': 'split'
                },
                {
                    'name': '递增(A)'
                },
                {
                    'name': '递减(D)'
                }
            ]
        },
        {
            'name': '刷新(E)',
            'icon': '',
            'click': refresh
        },
        {
            'name': 'split',
            'icon': '',
        },
        {
            'name': '粘贴(P)',
            'icon': '',
            'click': pasteFile,
            'disable': true
        },
        /*{
            'name': '粘贴快捷方式(S)',
            'icon': '',
            'disable': true
        },*/
        {
            'name': '全部还原',
            'icon': '',
            'click': restoreAllFile
        },
        {
            'name': '清空回收站',
            'icon': '',
            'click': clearTrash
        },
        {
            'name': 'split',
            'icon': '',
        },
        {
            'name': '属性(R)',
            'icon': '',
            'click': function() {
                getAttrPop(this.getAttribute('_id'));
            }
        }
    ],
    'deskMenu': [
        {
            'name': '查看(V)',
            'icon': '',
            'children': [
                {
                    'name': '大图标',
                    'icon': '',
                    'click': function () {
                        setDeskIcon('big');
                    }
                },
                {
                    'name': '中等图标',
                    'icon': '',
                    'click': function () {
                        setDeskIcon('mid');
                    }
                },
                {
                    'name': '小图标',
                    'icon': '',
                    'click': function () {
                        setDeskIcon('small');
                    }
                },
                {
                    'name': 'split'

                },
                {
                    'name': '自动排列图标',
                    'icon': '',
                    'click': autoPosition
                },
                {
                    'name': '将图标与网格对齐',
                    'icon': '',
                    'click': autoGrid
                }
            ]
        },
        {
            'name': '排序方式(O)',
            'icon': '',
            'children': [
                {
                    'name': '名称',
                    'icon': ''
                },
                {
                    'name': '大小',
                    'icon': ''
                },
                {
                    'name': '项目类型',
                    'icon': ''
                },
                {
                    'name': '修改日期',
                    'icon': ''
                }
            ]
        },
        {
            'name': '刷新(E)',
            'icon': '',
            'click': refresh
        },
        {
            'name': 'split',
            'icon': '',
        },
        {
            'name': '粘贴(P)',
            'icon': '',
            'click': pasteFile,
            'disable': true
        },
        /*{
            'name': '粘贴快捷方式(S)',
            'icon': '',
            'disable': true
        },*/
        {
            'name': '<label class="upload">文件上传<input type="file"></label>',
            'icon': '',
            'click': uploadFile
        },
        {
            'name': 'split',
            'icon': '',
        },
        {
            'name': '新建(W)',
            'icon': '',
            'children': [
                {
                    'name': '文件夹',
                    'icon': 'icon-i1',
                    'clickInfo': {
                        'type': 'floder'
                    },
                    'click': createFile
                },
                {
                    'name': 'Microsoft Word文档',
                    'icon': 'icon-i4',
                    'clickInfo': {
                        'type': 'word'
                    },
                    'click': createFile
                },
                {
                    'name': 'Microsoft PowerPoint 幻灯片',
                    'icon': 'icon-i5',
                    'clickInfo': {
                        'type': 'ppt'
                    },
                    'click': createFile
                },
                {
                    'name': '文本文档',
                    'icon': 'icon-i6',
                    'clickInfo': {
                        'type': 'text'
                    },
                    'click': createFile
                },
                {
                    'name': 'Microsoft Excel 工作表',
                    'icon': 'icon-i7',
                    'clickInfo': {
                        'type': 'excel'
                    },
                    'click': createFile
                },
                {
                    'name': 'zip文件',
                    'icon': 'icon-i8',
                    'clickInfo': {
                        'type': 'zip'
                    },
                    'click': createFile
                }
            ]
        },
        {
            'name': 'split',
            'icon': '',
        },
        {
            'name': '小工具(G)',
            'icon': 'icon-tool'
        },
        {
            'name': '个性化(R)',
            'icon': 'icon-per'
        }
    ],
    'deskIconMenu': [
        {
            'name': '打开(O)',
            'icon': '',
            'click': function(ev) {
                getExplorer(this.getAttribute('_id'));
            }
        },
        {
            'name': 'split',
            'icon': '',
        },
        /*{
            'name': '创建快捷方式(S)',
            'icon': ''
        },*/
        {
            'name': '重命名(M)',
            'icon': '',
            'click': reviseFileName
        },
        {
            'name': 'split',
            'icon': '',
        },
        {
            'name': '属性(R)',
            'icon': '',
            'click': function() {
                getAttrPop(this.getAttribute('_id'));
            }
        }
    ],
    'setMenu': [
        {
            'name': '打开(O)',
            'icon': '',
            'click': function(ev) {

            }
        },
        {
            'name': 'split',
            'icon': '',
        },
        /*{
            'name': '创建快捷方式(S)',
            'icon': ''
        },*/
        {
            'name': '重命名(M)',
            'icon': '',
            'click': reviseFileName
        },
        {
            'name': 'split',
            'icon': '',
        },
        {
            'name': '属性(R)',
            'icon': '',
            'click': function() {
                getAttrPop(this.getAttribute('_id'));
            }
        }
    ],
    'trashMenu': [
        {
            'name': '打开(O)',
            'icon': '',
            'click': function(ev) {
                getExplorer(this.getAttribute('_id'));
            }
        },
        {
            'name': '清空回收站(B)',
            'icon': '',
            'click': clearTrash
        },
        {
            'name': 'split',
            'icon': '',
        },
       /* {
            'name': '创建快捷方式(S)',
            'icon': ''
        },*/
        {
            'name': '重命名(M)',
            'icon': '',
            'click': reviseFileName
        },
        {
            'name': 'split',
            'icon': '',
        },
        {
            'name': '属性(R)',
            'icon': '',
            'click': function() {
                getAttrPop(this.getAttribute('_id'));
            }
        }
    ]
}

/*文件类型*/
var typeList = {
    'floder': {
        'name': '文件夹',
        'icon': 'img/icon/icon4.png',
        'dblclick': function(id) {
            var ul = getParentElByAttrAndVal(this, 'tagName', 'UL', true);
            if (ul == desk) {
                getExplorer(id);
            } else{
                ul.setAttribute('_id', id);
                render(ul, id);
            }
        },
        'menuName': 'floderMenu'
    },
    'word':  {
        'name': 'Microsoft Word文档',
        'icon': 'img/icon/word.png',
        'menuName': 'fileMenu'
    },
    'ppt':  {
        'name': 'Microsoft PowerPoint 幻灯片',
        'icon': 'img/icon/ppt.png',
        'menuName': 'fileMenu'
    },
    'text':  {
        'name': '文本文档',
        'icon': 'img/icon/text.png',
        'menuName': 'fileMenu',
        'dblclick': getFileWindow
    },
    'excel':  {
        'name': 'Microsoft Excel 工作表',
        'icon': 'img/icon/excel.png',
        'menuName': 'fileMenu'
    },
    'zip':  {
        'name': 'zip文件',
        'icon': 'img/icon/zip.png',
        'menuName': 'fileMenu'
    } ,
    'manage':  {
        'name': '博客管理',
        'icon': 'img/icon/icon16.png',
        'dblclick': getExplorer,
        'menuName': 'deskIconMenu'
    } ,
    'set':  {
        'name': '设置',
        'icon': 'img/icon/icon47.png',
        'menuName': 'setMenu'
    } ,
    'trash':  {
        'name': '回收站',
        'icon': 'img/icon/icon32.png',
        'dblclick': function(pid) {
            var taskInfo = taskList['trash'];
            if (!taskInfo || (taskInfo && !taskInfo.list[0])) {
                getExplorer(pid);
            } else {
                taskInfo.list[0].showEl.style.zIndex = ++ZINDEX;
            }
        },
        'menuName': 'trashMenu'
    } ,
    'desk':  {
        'name': '桌面',
        'icon': 'img/icon/icon35.png',
        'menuName': 'deskMenu'
    },
    'window':  {
        'name': '窗口',
        'icon': '',
        'menuName': 'windowMenu'
    },
    'calc': {
        'name': '计算器',
        'icon': 'img/icon/calc.png'
    },
    'audio': {
        'name': '音频',
        'icon': 'img/icon/wangyi.png',
        'menuName': 'fileMenu',
        'dblclick': getAudioPlayer
    },
    'video': {
        'name': '视频',
        'icon': 'img/icon/bangfeng.png',
        'menuName': 'fileMenu',
        'dblclick': getVideoPlayer
    },
    'image': {
        'name': '图片',
        'icon': 'img/icon/icon303.png',
        'menuName': 'fileMenu',
        'dblclick': getFileWindow
    },
    'unknow': {
        'name': '未知类型',
        'icon': 'img/icon/icon272.png',
        'menuName': 'fileMenu',
        'dblclick': getFileWindow

    }
};

/*文件数据*/
var fileList = [
    {
        'id': 1,
        'pid': 0,
        'left': 5,
        'top': 5,
        'name': '博客管理',
        'type': 'manage'
    },
    {
        'id': 2,
        'pid': 0,
        'left': 5,
        'top': 70,
        'name': '设置',
        'type': 'set'
    },
    {
        'id': 3,
        'pid': 0,
        'left': 5,
        'top': 135,
        'name': '回收站',
        'type': 'trash'
    },
    {
        id: 4,
        name: "新建文件夹",
        pid: 1,
        type: 'floder'
    },
    {   "id":5,
        "type":'word',
        "pid":1,
        "name":"新建Microsoft Word文档"
    },
    {
        "id":6,
        "type":'excel',
        "pid":1,
        "name":"新建Microsoft Excel 工作表"
    },
    {   "id":7,
        "type":'ppt',
        "pid":1,
        "name":"新建Microsoft PowerPoint 幻灯片"
    },
    {
        "id":8,
        type: 'floder',
        "pid":1,
        "name":"新建文件夹(2)"
    },
    {
        "id":9,
        type: 'floder',
        "pid":1,
        "name":"新建文件夹(3)"
    },
    {
        "id":10,
        type: 'zip',
        "pid":1,
        "name":"新建zip文件"
    },
    {
        "id":11,
        type: 'excel',
        "pid":1,
        "name":"新建Microsoft Excel 工作表(2)"},
    {
        "id":12,
        type: 'floder',
        "pid":4,
        "name":"新建文件夹"
    },
    {
        "id":13,
        type: 'floder',
        "pid":4,
        "name":"新建文件夹(2)"
    },
    {
        "id":14,
        type: 'excel',
        "pid":4,
        "name":"新建Microsoft Excel 工作表"
    },
    {
        "id":15,
        type: 'word',
        "pid":4,
        "name":"新建Microsoft Word文档"
    },
    {
        "id":16,
        type: 'floder',
        "pid":13,
        "name":"新建文件夹"
    },
    {
        "id":17,
        type: 'floder',
        "pid":13,
        "name":"新建文件夹(2)"
    },
    {
        "id":18,
        type: 'text',
        "pid":16,
        "name":"新建文本文档"
    },
    {
        "left": 5,
        "top": 200,
        "id":19,
        type: 'floder',
        "pid":0,
        "name":"新建文件夹"
    },
    {
        "left": 5,
        "top": 265,
        "id": 20,
        type: 'word',
        "pid":0,
        "name":"新建Microsoft Word文档"
    },
    {
        "left": 5,
        "top": 330,
        "id": 21,
        type: 'excel',
        "pid":0,
        "name":"新建Microsoft Excel 工作表"
    },
    {
        "left": 5,
        "top": 395,
        "id": 22,
        type: 'ppt',
        "pid":0,
        "name":"新建Microsoft PowerPoint 幻灯片"
    },
    {
        "left": 5,
        "top": 460,
        "id": 23,
        type: 'text',
        "pid":0,
        "name":"文本文档"
    },
    {
        "left": 81,
        "top": 5,
        "id": 25,
        type: 'zip',
        "pid": 0,
        "name":"xxxz"
    }
];

/*图标大小*/
var iconInfoList = {
    'desk': {
        'big': {
            'width': 100,
            'height': 116,
            'marginTop': 64,
            'img': 96
        },
        'mid': {
            'width': 70,
            'height': 68,
            'marginTop': 33,
            'img': 46
        },
        'small': {
            'width': 70,
            'height': 52,
            'marginTop': 9,
            'img': 32
        },
        'select': 'small'
    },
    'window': {

    }
}

/*音频列表*/
var audioList = {
    list: [27, 28],
    index: 0
};

/*视频列表*/
var videoList = {
    list: [29],
    index: 0
};

/*任务栏*/
var taskList = {
    'audio': {
        order: 0,
        isShortcut: true,
        isOpen: false,
        list: [
            {
                showEl: document.querySelector('.music-player')
            }
        ]
    },
    'video': {
        order: 1,
        isShortcut: true,
        isOpen: false,
        list: [
            {
                showEl: document.querySelector('.video-player-wrap')
            }
        ]
    }
};

var MAXID;//最大ID
var DESKID = 0;//桌面ID
var TRASHID = 3;//垃圾桶ID
var deskUDIds = [1, 2];//桌面不能删除的ID
var ZINDEX = 1;//层级
var isClear = true;

var desk = document.querySelector('.desk');//桌面
desk.setAttribute('_menuname', 'deskMenu');//菜单事件
desk.setAttribute('_dragrect', 'true');//选框事件
desk.setAttribute('_id', '0');
var hiddenElement = document.querySelector('.hidden');
