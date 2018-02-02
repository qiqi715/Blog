/*渲染底部任务栏*/
function renderTaskColumn() {
    var taskEl = document.querySelector('.t-task');
    taskEl.innerHTML = '<span class="t-split icon fl"></span>';
    for(var typeName in taskList) {
        var taskInfo = taskList[typeName];
        var typeItem = typeList[typeName];
        taskInfo.list.forEach(function(item, index) {
            var tkItem = createTag(taskEl, 'div', {'className': 'tk-item fl'});
            var img = createTag(tkItem, 'img', {'src': item.icon ? item.icon : typeItem.icon});
            /*如果是快捷方式且没有打开*/
            if (taskInfo.isShortcut && !taskInfo.isOpen) {
                tkItem.addEventListener('click', function() {
                    typeItem.dblclick && typeItem.dblclick();
                });
            }
            /*快捷方式打开 或者 不是快捷方式*/
            if (taskInfo.isOpen || !taskInfo.isShortcut){
                addClassName(tkItem, 'open');
                createTag(tkItem, 'span', {'innerHTML': (item.name ? item.name : typeItem.name)});
                addShowEl({
                    clickEl: tkItem,
                    showEl: item.showEl
                });
                item.showEl.setAttribute('typeName', typeName);
                item.showEl.setAttribute('taskIndex', index);
            }
        });
    }
}

/**
 * 渲染容器内容
 * @param container 容器
 * @param pid 父级id
 */
function render(container, pid) {
    if(container == desk) {
        renderDesk(container, pid);
    } else {
        renderCont(container, pid);
    }
}

/**
 * 渲染桌面数据
 * @param container 容器
 * @param pid 父级id
 */
function renderDesk(container, pid) {
    var dataList = getChildren(fileList, pid);
    container.innerHTML = '';
    dataList.forEach(function(item) {
        var type = typeList[item.type];
        var select = iconInfoList['desk']['select'];
        var info = iconInfoList['desk'][select];
        //创建li
        var li = createTag(container, 'li', { className: 'desk-icon-box'});
        li.style.left = item.left + 'px';
        li.style.top = item.top + 'px';
        li.style.width = info.width + 'px';
        li.style.height = info.height + 'px';
        //创建图片
        var img = createTag(li, 'img', { className: 'desk-icon', src: type.icon});
        img.style.width = info.img + 'px';
        img.style.height = info.img + 'px';
        //创建文字
        var p = createTag(li, 'p', {innerHTML: item.name});

        /*1.设置基本功能*/
        setBaseFunc(li);
        /*2.设置右键菜单*/
        li.setAttribute('_id', item.id);
        if (type.menuName) {
            li.setAttribute('_menuname', pid == TRASHID ? type.menuName : type.menuName);
        }
        /*3.设置双击打开*/
        li.addEventListener('dblclick', function() {
            type.dblclick && type.dblclick.call(li, item.id);
        });
        /*4.拖拽移动和删除*/
        dragDelete(li);
    });
    renderAllLeftMenu();
}

/*渲染所有的窗口内容*/
function renderAllcont() {
    var arrType = ['manage', 'trash', 'floder'];
    arrType.forEach(function(type) {
        renderBytype(type, function(obj) {
            var container = obj.showEl.querySelector('.right-box .cont');
            var id = container.getAttribute('_id');
            renderCont(container, id);
        })
    });
}

/**
 * 渲染窗口右侧主体内容
 * @param container 容器
 * @param pid 父级id
 */
function renderCont(container, pid) {
    var dataList = getChildren(fileList, pid);
    container.innerHTML = '';
    var oWindow = getParentElByAttrAndVal(container, 'className', 'window', true);
    renderCrumbs(oWindow, container, pid);
    dataList.forEach(function(item){
        var type = typeList[item.type];
        var li = createTag(container, 'li');
        var div = createTag(li, 'div', {className: 'pic'});
        var img = createTag(div, 'img', {src: type.icon});//图片
        var p = createTag(li, 'p', {innerHTML: item.name});//名称
        setStateOnBlank(oWindow,  dataList);

        /*1.设置基本功能*/
        setBaseFunc(li);
        /*2.设置右键菜单*/
        li.setAttribute('_id', item.id);
        if (type.menuName) {
            li.setAttribute('_menuname', pid == TRASHID ? 'fileTrashMenu' : type.menuName);
        }
        /*3.设置双击打开*/
        li.addEventListener('dblclick', function() {
            type.dblclick && type.dblclick.call(li, item.id);
        });
        /*4.拖拽移动和删除*/
        dragDelete(li);
        /*5.单击显示文件状态*/
        li.addEventListener('click', function() {
            showState(oWindow, item, type);
        });

    });

    /*5.窗口空白处单击*/
    container.addEventListener('click', function(ev) {
        if (ev.target.tagName == 'UL') {
            setStateOnBlank(oWindow,  dataList);
        }
    });
}

/**
 * 渲染窗口中 面包屑内容
 * @param oWindow 窗口
 * @param container 容器
 * @param pid 父级id
 */
function renderCrumbs(oWindow, container, pid) {
    var siteList = oWindow.querySelector('.site-list');
    siteList.innerHTML = '';
    var parents = getParents(fileList, pid);
    var cur = getObjById(fileList, pid);
    var firstParent = container.getAttribute('_pid') == cur.id ? cur : parents[0];

    var inner = '<li><img src="' + typeList[firstParent.type].icon + '"><span class="icon next"></span></li>';
    inner += parents.concat(cur).map(function(item) {
            return '<li _id="' + item.id +'">' + item.name + '<span class="icon next"></span></li>';
        }).join('') + '<li>';
    siteList.innerHTML  = inner;
    siteList.addEventListener('click', function(ev) {
        var li = ev.target;
        if (li.tagName == 'LI' && li.getAttribute('_id')) {
            var id  = li.getAttribute('_id');
            container.setAttribute('_id', id);
            render(container, id);
        }
    });

    var aLis = siteList.querySelectorAll('li');
    var maxW = css(siteList.parentNode, 'width');
    var sumW = aLis[0].offsetWidth;
    var end;
    for (var i = aLis.length - 1; i > 0; i--) {
        sumW += aLis[i].offsetWidth;
        if (sumW > maxW) {
            aLis[0].lastElementChild.className = 'icon pre';
            end = i;
            break;
        }
    }
    for (var i = end; i > 0 ; i--) {
        aLis[i].style.display = 'none';
    }
}

/*渲染全部窗口左侧菜单栏*/
function renderAllLeftMenu() {
    var arrType = ['manage', 'trash', 'floder'];
    arrType.forEach(function(type) {
        renderBytype(type, function(obj){
            renderLeftMenu(obj.showEl);
        });
    });
}

/**
 * 根据类型渲染
 * @param type 类型
 * @param backFn 渲染回调函数
 */
function renderBytype(type, backFn) {
    var taskInfo = taskList[type];
    if (taskInfo && taskInfo.list[0]) {
        taskInfo.list.forEach(function(obj){
            backFn && backFn(obj);
        });
    }
}

/**
 * 渲染窗口左侧菜单
 * @param oWindow 窗口
 */
function renderLeftMenu(oWindow) {
    var container = oWindow.querySelector('.left-menu');
    container.innerHTML = '';
    var deskLi = createLeftMenuLi(container, 0, 'desk', DESKID);
    deskLi.firstElementChild.className = 'icon lm-open';
    var list = createTag(deskLi,'ul', {className: 'left-menu'});

    var dataList = getChildren(fileList, DESKID);
    dataList.forEach(function(item, index) {
        var isIcon = isHasFiletype(fileList, item.id, 'floder');
        var li = createLeftMenuLi(list, index, item.type, isIcon, item.id, item.name);
    });
}

/**
 * 生成左侧菜单li
 * @param container 容器
 * @param index list中第几个
 * @param typeName 类型名
 * @param isIcon 是否有图标
 * @param id id
 * @param name 名称
 * @returns {Element|*}
 */
function createLeftMenuLi(container,index, typeName, isIcon, id, name) {
    var type = typeList[typeName];
    var li = createTag(container, 'li');
    li.style.top = 23 * index + 'px';
    var i = createTag(li, 'i', {className: isIcon? 'icon' : ''});
    var img = createTag(li, 'img', {src: type.icon});
    var p = createTag(li, 'p', {innerHTML: name? name : type.name});
    return li;
}

/*渲染回收站内容*/
function renderTrashCont() {
    var taskInfo = taskList['trash'];
    if (taskInfo && taskInfo.list[0]){
        var container = taskInfo.list[0].showEl.querySelector('.right-box .cont');
        renderCont(container, TRASHID);
    }
}

/**
 * 获得资源管理器
 * @param pid 父级id
 */
function getExplorer(pid) {
    var item = getObjById(fileList, pid);
    var fPid = item.pid == 0 ?  pid : getParents(fileList, pid)[0].id;//一级父级
    createWindow(fPid, function(fPid, oWindow, oWindowCont) {
        createSiteBox();
        createColumnMenu();
        createColumnTool();
        var cont = createCont();
        cont.setAttribute('_pid', fPid);//一级父级
        cont.setAttribute('_id', pid);//当前父级

        /*1.自定义菜单*/
        cont.setAttribute('_menuname', fPid == TRASHID ? 'windowTrashMenu' : 'windowMenu');
        /*2.拖拽选框选择*/
        cont.setAttribute('_dragRect', 'true');
        renderLeftMenu(oWindow);
        renderCont(cont, pid);

        /*生产地址栏*/
        function createSiteBox() {
            var siteBox = createTag(oWindowCont, 'div', {className: 'site-box'});
            var sbBtns = createTag(siteBox, 'div', {className: 'btns fl'});//左右按钮
            var leftBtn = createTag(sbBtns, 'input', {type: 'button', className: 'icon fl left'});
            leftBtn.addEventListener('click', function() {
                var parent = getParentById(fileList, cont.getAttribute('_id'));
                var id = parent ? parent.id : cont.getAttribute('_pid');
                cont.setAttribute('_id', id);
                renderCont(cont, id);
            });
            var rightBtn = createTag(sbBtns, 'input', {type: 'button', className: 'icon fr right-gray'});
            var siteListBox = createTag(siteBox, 'div', {className: 'site-list-box'});//地址栏
            var siteList = createTag(siteListBox, 'ul', {className: 'site-list'});
            var searchBox = createTag(siteBox, 'div', {className: 'search-box fr'});//搜索框
            var searchTxt = createTag(searchBox, 'input', {type: 'text', className: 'inp-txt', placeholder: '搜索'});
            var searchIcon = createTag(searchBox, 'span', {className: 'icon icon-search'});
            return siteBox;
        }

        /*生成菜单栏*/
        function createColumnMenu() {
            var columnMenu = createTag(oWindowCont, 'ul', {className: 'column-menu',
                innerHTML: '<li>文件</li><li>编辑</li><li class="">查看</li>'});
            return columnMenu;
        }

        /*生成工具栏*/
        function createColumnTool() {
            var columnTool = createTag(oWindowCont, 'div', {className: 'column-tool-box'});
            /*左侧导航*/
            var ctl = createTag(columnTool, 'nav', {className: 'column-tool fl',
                innerHTML: '<input  type="button" value="组织" class="">' +
                '<input  type="button" value="新建文件夹" class="">'});
            /*右侧导航*/
            var ctr = createTag(columnTool, 'nav', {className: 'column-tool fr'});
            var reviseView = createTag(ctr, 'div', {className: 'btn-view fl'});//更改视图按钮
            var reviseViewImg= createTag(reviseView, 'img', {className: 'fl',
                src: 'img/icon/icon299.png'});
            var reviseViewSpan= createTag(reviseView, 'span', {className: 'more fl',
                innerHTML: '<i></i>'});
            return columnTool;
        }

        /*生产主体内容*/
        function createCont() {
            var contBox = createTag(oWindowCont, 'div', {className: 'cont-box'});
            var leftBox = createTag(contBox, 'div', {className: 'left-box'});//左侧菜单
            var leftMenu = createTag(leftBox, 'ul', {className: 'left-menu'});
            var rightBox = createTag(contBox, 'div', {className: 'right-box'});
            var cont = createTag(rightBox, 'ul', {className: 'cont'});
            var stateBox = createTag(oWindowCont, 'div', {className: 'state-box'});//状态栏
            var selectBox = createTag(oWindowCont, 'p', {className: 'select-box'});//选择栏
            return cont;
        }
    });
}

/**
 * 获得上传文件窗口
 * @param pid 父级id
 */
function getFileWindow(pid) {
    createWindow(pid, createFileWindow, true);

    /*生成文件窗口主体内容*/
    function createFileWindow(pid, oWindow, oWindowCont) {
        var contBox = createTag(oWindowCont, 'div', {className: 'cont-box up-box'});
        var cont;
        var item = getObjById(fileList, pid);
        if (item.type == 'image') {
            cont = createTag(contBox, 'img', {className: 'up-img'});
            cont.src = item.src;
        } else if (item.type == 'text') {
            cont = createTag(contBox, 'p', {className: 'up-txt'});
            cont.innerHTML = item.src ? item.src.replace(/\n/g, '\n') : '';
        }
    }
}

/**
 * 获得属性弹框
 * @param pid
 */
function getAttrPop(pid) {
    createPop({
        pid: pid,
        suffix: '属性',
        createFn: function(pop, popWrap, type, item) {
            var contBox = createTag(popWrap, 'div', {className: 'cont-box'});
            var submenu = createTag(contBox, 'ul', {className: 'submenu',
                innerHTML: '<li class="active">属性</li>'});
            var cont = createTag(contBox, 'div', {className: 'cont'});
            var infoList = createTag(cont, 'ul', {className: 'info-list'});
            var inner = '<li class="has-ico"> ' +
                '<h4><img src="' + type.icon + '"></h4> ' +
                '<p><input type="text" class="inp-txt" value="' + item.name + '"></p>' +
                '</li>' +
                '<li class="has-line">' +
                '<h4>类型：</h4>' +
                '<p>' + type.name + '</p>' +
                '</li>' +
                '<li>' +
                '<h4>位置：</h4>' +
                '<p>' + getParents(fileList, item.pid).concat(item).map(function(item) {
                    return item.name
                }).join(" / ")+ '</p>' +
                '</li>' +
                '<li>' +
                '<h4>包含：</h4>' +
                '<p></p>' +
                '</li>' +
                '<li class="has-line">' +
                '<h4>属性：</h4>' +
                '<p>' +
                '<label><input type="checkbox" checked>只读(只应用于文件夹中的文件)(R)</label>' +
                '<label><input type="checkbox" >影藏</label>' +
                '</p>' +
                '</li>';
            infoList.innerHTML = inner;
        }
    });
}

/**
 * 在空白处点击
 * @param oWindow 窗口
 * @param dataList 窗口数据
 */
function setStateOnBlank(oWindow, dataList) {
    var state = oWindow.querySelector('.state-box');
    state.innerHTML = '<img src="img/icon/icon4.png" class="fl"> ' +
        '<div class="state fl">' + dataList.length + '个对象</div>';

    var select = oWindow.querySelector('.select-box');
    select.innerHTML = dataList.length + '个项目';
}

/**
 * 显示状态
 * @param oWindow 窗口
 * @param item 选择的li的数据
 * @param type 选择的li的类型
 */
function showState(oWindow, item, type) {
    var state = oWindow.querySelector('.state-box');
    state.innerHTML = '<img src="' + type.icon + '" class="fl"> ' +
        '<div class="state fl">' +
        '<p>' + item.name + '</p>' +
        '<p class="type">' +  type.name + '</p>' +
        '</div>';
    var select = oWindow.querySelector('.select-box');
    select.innerHTML = '已选择 1 项';
}

/**
 * 获取一级菜单数据
 * @param el 一级菜单触发元素
 * @param menuName 菜单名
 * @param ev 一级菜单事件对象
 */
function createFirstMenu(el, menuName, ev) {
    if (el.tagName == 'LI') {
        if (hasClassName(el, 'active')) {
            removeMenu(document.body);
        } else {
            clearActiveAndMenu();
            addClassName(el, 'active');
        }
    } else {
        clearActiveAndMenu();
    }
    var menuData = menuList[menuName];
    var menu = createMenu(document.body, el, menuData, ev);

    var left = ev.clientX;
    var top = ev.clientY;
    var maxL = window.innerWidth - menu.offsetWidth;
    var maxT = window.innerHeight -  menu.offsetHeight;
    if (left > maxL) {
        left = maxL;
    }
    if (top > maxT) {
        if (top - menu.offsetHeight < 0) {
            top = -menu.offsetHeight;
        } else {
            top = top - menu.offsetHeight;
        }
    }
    css(menu, 'left', left);
    css(menu, 'top', top);
    css(menu, 'zIndex', ++ZINDEX);
    ev.preventDefault();
}

/**
 * 创建菜单
 * @param parent 菜单父级
 * @param el 一级菜单触发元素
 * @param data 数据
 * @param pEv 一级菜单事件对象
 * @returns {Element|*}
 */
function createMenu(parent, el, data, pEv) {
    var menu = createTag(parent, 'ul', {className: 'menu'});

    /*生产子项*/
    data.forEach(function(item) {
        var li = createTag(menu, 'li');
        if (item.disable) {
            li.className = 'disable';
        }
        if (item.name.indexOf('粘贴') != -1 && repeatFiles.length) {
            li.className = '';
        }
        var a = createTag(li, 'a', {href: '#'});
        var span = createTag(a, 'span', {className: 'icon-box'});
        if (item.icon && item.icon.trim() != '') {
            var i = createTag(span, 'i', {className: 'icon ' + item.icon});
        }
        var p = createTag(a, 'p', {innerHTML: item.name});
        if (item.name == 'split') {
            li.className = 'split';
            p.innerHTML = '<span class="gray"></span><span class="white"></span>';
        }
        if(Array.isArray(item.children) && item.children.length > 0) {
            p.innerHTML += '<span class="right"></span>';
        }

        /*子项移入*/
        li.addEventListener('mouseover', function(){
            if (li.className != 'split') {
                addClassName(li, 'active');
                if (!Array.isArray(item.children)) {
                    return;
                }
                if (!li.isCreate) {
                    li.isCreate = true;
                    var subList = createMenu(li, el, item.children, pEv);
                    li.appendChild(subList);
                }
                var subList = li.lastElementChild;
                var subLeft = li.offsetWidth - 2;
                var subTop = -4;
                if (li.getBoundingClientRect().right - 2  + subList.offsetWidth > window.innerWidth) {
                    subLeft = - li.offsetWidth + 2;
                }
                if (li.getBoundingClientRect().top - 4 + subList.offsetHeight > window.innerHeight) {
                    subTop = - subList.offsetHeight + li.offsetHeight + 4;
                }
                css(subList, 'left', subLeft);
                css(subList, 'top', subTop);
            }
        });

        /*子项点击*/
        if (item.click) {
            li.addEventListener('click', function(ev) {
                item.click.call(el, pEv, item.clickInfo, li);
            });
        }
    });

    /*菜单移出*/
    menu.addEventListener('mouseout', function(ev){
        menu.querySelectorAll('.active').forEach(function(li) {
            removeClassName(li, 'active');
        });
        ev.stopPropagation();
    });

    return menu;
}

/**
 * 设置桌面图标大小
 * @param select 选择的图标大小
 */
function setDeskIcon(select) {
    iconInfoList['desk']['select'] = select;
    autoPosition();
    render(desk, DESKID);
}

/*桌面图标自动对齐*/
function autoPosition() {
    var select = iconInfoList.desk.select;
    var info = iconInfoList.desk[select];
    var paddingLeft = 5;
    var paddingTop = 5;
    var iWidth = info.width;
    var iHeight = info.height;
    var marginLeft = 2;
    var marginTop = info.marginTop;
    var border = 2 * 2;
    var h = desk.clientHeight - paddingTop + marginTop;
    var row = Math.floor(h / (iHeight + border + marginTop));
    var dataList = getChildren(fileList, DESKID);
    dataList.forEach(function(item, index) {
        item.left = (iWidth + border + marginLeft) * Math.floor((index / row)) + paddingLeft;
        item.top = (iHeight + border + marginTop) * (index % row) + paddingTop;
    });
    render(desk, DESKID);
}

/*自动网格对齐*/
function autoGrid() {
    var select = iconInfoList.desk.select;
    var info = iconInfoList.desk[select];
    var paddingLeft = 5;
    var paddingTop = 5;
    var gridW = info.width + 4 + 2;
    var gridH = info.height + 4 + info.marginTop;
    var dataList = getChildren(fileList, DESKID);
    dataList.forEach(function(item) {
        var i = Math.ceil((item.left - paddingLeft) / gridW);
        var j = Math.floor((item.top - paddingTop) / gridH);
        item.left = gridW * i + paddingLeft;
        item.top = gridH * j + paddingTop;
    });
    render(desk, DESKID);
}

/*获取桌面空白位置*/
function getDeskPosition() {
    var dataList = getChildren(fileList, DESKID);
    dataList.sort(function(a, b) {
        if (a.left == b.left) {
            return a.top - b.top;
        } else {
            return a.left - b.left;
        }
    });
    var select = iconInfoList.desk.select;
    var info = iconInfoList.desk[select];
    var paddingLeft = 5;
    var paddingTop = 5;
    var border = 4;
    var width = info.width + border ;
    var height = info.height + border;
    var gridW = info.width + border + 2;
    var gridH = info.height + border + info.marginTop;
    var h = desk.clientHeight - paddingTop + info.marginTop;
    var row = Math.floor(h / gridH);


    var i = 0;//列
    var j = 0;//行
    while(true) {
        var isTake = false;
        var l = i * gridW + paddingLeft;
        var t = j * gridH + paddingTop;
        for(var k = 0; k < dataList.length; k++) {
            if (!(dataList[k].left > l + gridW
                || dataList[k].left + width < l
                || dataList[k].top > t + gridH
                || dataList[k].top + height < t )) {
                isTake = true;
                break;
            }
        }
        if (!isTake) {
            break;
        } else {
            j++;
            if (j >= row) {
                i++;
                j = 0;
            }
        }
    }
    return {
        left: i*gridW + paddingLeft,
        top: j*gridH + paddingTop
    }
}

/**
 * 播放音频
 * @param id 音频id
 */
function getAudioPlayer(id) {
    getPlayer(audioList, id, 'audio', showAudioPlayer);
}

/**
 * 播放视频
 * @param id 视频id
 */
function getVideoPlayer(id) {
    getPlayer(videoList, id, 'video', showVideoPlayer);
}

/**
 * 显示播放器
 * @param dataList 播放器列表数组
 * @param id 播放的id
 * @param typeName 类型名称
 * @param blockFn 显示后的回调函数
 */
function getPlayer(dataList, id, typeName, blockFn) {
    /*新增到列表*/
    if (id) {
        var index = dataList.list.indexOf(id);
        if (index != -1) {
            dataList.index = index;
        } else {
            dataList.list.push(id);
            dataList.index = dataList.list.length - 1;
        }
    }
    /*添加底部任务栏*/
    var taskInfo = taskList[typeName];
    taskInfo.list[0].name = getObjById(fileList, dataList.list[dataList.index]).name;
    if(taskInfo.isShortcut && !taskInfo.isOpen) {
        taskInfo.isOpen = true;
    }
    renderTaskColumn();
    toShowEl(taskInfo.list[0].showEl, blockFn);
}

/*显示音频播放器*/
function showAudioPlayer() {
    var el = document.querySelector('.music-player');
    var needleEl = el.querySelector('.needle');//指针
    var diskImgEl = el.querySelector('.disk-cover img');//专辑图片
    showPlayer({
        dataList: audioList,
        el: el,
        dragEl: el.querySelector('.player-closebox'),
        initFn: function(item) {
            el.querySelector('.song').innerHTML = item.name;//歌名
            el.querySelector('.artist').innerHTML = item.artist ? item.artist : '未知歌手';//歌手名
        },
        btnShrink: el.querySelector('.btn-shrink'),
        /*btnMagify: el.querySelector('.btn-magify'),*/
        btnClose: el.querySelector('.btn-close'),
        playerEl: el.querySelector('audio'),
        playFn: function(btnPlay) {
            addClassName(btnPlay, 'btn-pause');
            css(needleEl, 'top', -18);
            css(needleEl, 'rotate', -20);
            var rotateDeg = 0;
            clearInterval(diskImgEl.timer);
            diskImgEl.timer = setInterval(function() {
                css(diskImgEl, 'rotate', ++rotateDeg);
            }, 50);
        },
        pauseFn: function(btnPlay) {
            removeClassName(btnPlay, 'btn-pause');
            css(needleEl, 'top', -55);
            css(needleEl, 'rotate', -60);
            clearInterval(diskImgEl.timer);
            css(diskImgEl, 'rotate', 0);
        },
        footerEl: el.querySelector('.play-footer'),

       /* minusEl:  el.querySelector('.btn-minus'),
        plusEl: el.querySelector('.btn-plus'),
        stopEl: el.querySelector('.btn-stop'),*/

        currentTimeEl:  el.querySelector('.current-time'),
        totalTimeEl:  el.querySelector('.total-time'),
        processBarEL: el.querySelector('.process-bar-box'),
        pLengtEl: el.querySelector('.process-bar .length'),
        pCurEl: el.querySelector('.process-bar .cur'),
       /* volumnBarEL: el.querySelector('.volumn-bar-box'),
        vLengtEl: el.querySelector('.volumn-bar .length'),
        vCurEl: el.querySelector('.volumn-bar .cur'),*/

        btnPre: el.querySelector('.btn-pre'),
        btnPlay: el.querySelector('.btn-play'),
        btnNext: el.querySelector('.btn-next')
    });
}

/*显示视频播放器*/
function showVideoPlayer() {
    var el = document.querySelector('.video-player-wrap');
    var nameEl = el.querySelector('.video-name');
    showPlayer({
        dataList: videoList,
        el: el,
        dragEl: nameEl,
        initFn: function(item) {
            nameEl.innerHTML = item.name;//影片名
        },
        btnShrink: el.querySelector('.btn-shrink'),
        btnMagify: el.querySelector('.btn-magify'),
        btnClose: el.querySelector('.btn-close'),
        playerEl: el.querySelector('video'),
        playFn: function(btnPlay) {
            addClassName(btnPlay, 'btn-pause');
        },
        pauseFn: function(btnPlay) {
            removeClassName(btnPlay, 'btn-pause');
        },
        footerEl: el.querySelector('.controls-box'),

        minusEl:  el.querySelector('.btn-minus'),
        plusEl: el.querySelector('.btn-plus'),
        stopEl: el.querySelector('.btn-stop'),

        currentTimeEl:  el.querySelector('.current-time'),
        totalTimeEl:  el.querySelector('.total-time'),
        processBarEL: el.querySelector('.process-bar-box'),
        pLengtEl: el.querySelector('.process-bar .length'),
        pCurEl: el.querySelector('.process-bar .cur'),

        mutedEl: el.querySelector('.btn-volumn'),
        volumnBarEL: el.querySelector('.volumn-bar-box'),
        vLengtEl: el.querySelector('.volumn-bar .length'),
        vCurEl: el.querySelector('.volumn-bar .cur'),

        btnPre: el.querySelector('.btn-pre'),
        btnPlay: el.querySelector('.btn-play'),
        btnNext: el.querySelector('.btn-next'),
        btnSreen: el.querySelector('.btn-screen')
    });
}

/**
 * 显示播放器
 * @param init
 */
function showPlayer(init) {
    var el = init.el;
    var playerEl = init.playerEl;//播放器
    var dataList = init.dataList;
    var footerEl = init.footerEl;//底部控件
    initData();
    var currentTimeEl =  init.currentTimeEl;//当前时间

    /*拖拽窗口*/
    if(init.dragEl) {
        dragWindow(el, init.dragEl);
    }

    /*缩小播放器*/
    if (init.btnShrink) {
        shrinkClick(init.btnShrink, el);
    }

    /*放大播放器*/
    if (init.btnMagify) {
        magifyClick(init.btnMagify, el);
    }

    /*关闭播放器*/
    if(init.btnClose) {
        closeClick(init.btnClose, el, function() {
            playerPause();
        });
    }

    /*减速按键*/
    if (init.minusEl) {
        init.minusEl.onclick = function() {
            setPlaybackRate(-0.1);
        };
    }

    /*加速按键*/
    if (init.plusEl) {
        init.plusEl.onclick = function() {
            setPlaybackRate(0.1);
        };
    }

    /*静音按键*/
    if (init.mutedEl) {
        init.mutedEl.onclick = function() {
            playerEl.muted = !playerEl.muted;
        }
    }

    /*停止按键*/
    if (init.stopEl) {
        init.stopEl.onclick = function() {
            playerPause();
        };
    }

    /*全屏*/
    if (init.btnSreen) {
        init.btnSreen.onclick = function() {
            el.webkitRequestFullscreen();
        }
    }

    /*设置速度*/
    function setPlaybackRate(add) {
        playerEl.playbackRate += add;
    }

    /*前一首*/
    init.btnPre.onclick = function() {
        dataList.index--;
        if (dataList.index < 0) {
            dataList.index =  dataList.list.length - 1;
        }
        initData();
    };

    /*后一首*/
    init.btnNext.onclick = next;
    function next() {
        dataList.index++;
        if (dataList.index > dataList.list.length - 1) {
            dataList.index =  0;
        }
        initData();
    }

    var totalTime;//总时间

    /*加载元数据后*/
    playerEl.onloadedmetadata = function() {
        footerEl.style.display = 'block';
        totalTime = playerEl.duration;
        init.totalTimeEl.innerHTML = getMinuteSecond(totalTime);
        setTimeout(function() {
            if (init.processBarEL) {
                setProgress(init.processBarEL, init.pLengtEl, init.pCurEl, 'currentTime', totalTime);
            }
            if (init.volumnBarEL) {
                setProgress(init.volumnBarEL, init.vLengtEl, init.vCurEl, 'volume', 1);
            }
        }, 1000);
        /*开始播放按键*/
        init.btnPlay.onclick  = function() {
            if (playerEl.paused) {
                playerStart();
            } else {
                playerPause();
            }
        };
    };

    /*进度条上点击和拖拽*/
    function setProgress(barEl, lengthEl, curEL, attr, maxVal) {
        var maxL = css(barEl, 'width');

        /*进度条上点击*/
        barEl.onclick = function(ev){
            if (ev.target != barEl) {
                return;
            }
            var length = ev.clientX - barEl.getBoundingClientRect().left;
            css(lengthEl, 'width', length);
            css(curEL, 'left', length);;
            playerEl[attr] = parseInt(length / maxL * maxVal * 10) / 10;
        };

        /*拖拽进度条*/
        drag({
            el: curEL,
            start: function() {
                curEL.isDrag = true;
            },
            limit: function() {
                var top = css(curEL, 'top');
                return {
                    minL: 0, maxL: maxL,
                    minT: top, maxT: top
                }
            },
            move: function(ev, dragNode, dis) {
                var left = css(curEL, 'left');
                css(lengthEl, 'width', left);
            },
            end: function() {
                var left = css(curEL, 'left');
                playerEl[attr]  =  parseInt(left / maxL * maxVal * 10) / 10;
                curEL.isDrag = false;
            }
        });
    }

    /*时间发生改变*/
    playerEl.ontimeupdate = function() {
        var currentTime = playerEl.currentTime;
        totalTime = playerEl.duration;
        currentTimeEl.innerHTML = getMinuteSecond(currentTime);
        if (init.pCurEl && !init.pCurEl.isDrag) {
            progressChange(currentTime);
        }
    };

    /*停止*/
    playerEl.onended = next;


    /*当进度条发生改变*/
    function progressChange(currentTime) {
        var maxL = css(init.processBarEL, 'width');
        var curW = (currentTime / totalTime) * maxL;
        css(init.pLengtEl, 'width', curW);
        css(init.pCurEl, 'left', curW);
    }

    /*初始化数据*/
    function initData() {
        var id = dataList.list[dataList.index];
        var item = getObjById(fileList, id);
        init.initFn && init.initFn(item);
        playerEl.src = item.src;
        playerStart();
    }

    /*开始播放*/
    function playerStart() {
        playerEl.play();
        init.playFn && init.playFn(init.btnPlay);
    }

    /*暂停播放*/
    function playerPause() {
        playerEl.pause();
        init.pauseFn && init.pauseFn(init.btnPlay);
    }

}

/*生成计算器*/
function createCalculator() {
    createPop({
        typeName: 'calc',
        createFn: function(pop, popWrap) {
            pop.style.width = '226px';
            var calculator = createTag(popWrap, 'div', {className :'calculator'});
            var screen = createTag(calculator, 'div', {className :'screen'});
            var expression = createTag(screen, 'p', {className :'expression'});
            var num = createTag(screen, 'p', {className :'num', innerHTML: '0'});
            var list = createTag(calculator, 'ul', {className :'list clearfix'});
            list.innerHTML = '<li data-ac="del">←</li><li data-ac="ce">CE</li><li data-ac="cls">C</li>' +
                '<li data-ac="plus-minus">+-</li><li data-ac="sqrt">√</li> ' +
                '<li data-val="7">7</li><li data-val="8">8</li><li data-val="9">9</li>' +
                '<li data-ac="div">/</li><li data-ac="per">%</li> ' +
                '<li data-val="4">4</li><li data-val="5">5</li><li data-val="6">6</li>' +
                '<li data-ac="mul">*</li><li data-ac="frac">1/x</li> ' +
                '<li data-val="1">1</li><li data-val="2">2</li><li data-val="3">3</li>' +
                '<li data-ac="minus">-</li> ' +
                '<li data-val="0" class="col2">0</li>' +
                '<li data-ac="dot">.</li><li data-ac="plus">+</li><li data-ac="eq" class="row2">=</li>';

            var aLis = list.querySelectorAll('li');
            aLis.forEach(function(li){
                setBaseFunc(li);
            });
            calculate({
                el: list,
                expEl: expression,
                numEl: num
            });
        }
    });
}

/*计算器功能实现*/
function calculate(init) {
    var el = init.el;
    var expEl = init.expEl;
    var numEl = init.numEl;
    var infix = [];//中缀表达式
    var suffix = [];//后缀表达式
    var result = [];//后缀表达式计算结果
    var lastVal = 0;//当前计算的值
    var isDone = false;//是否结束
    var isDot = false;//是否点击了小数点
    var isWrong = false;//是否发生了错误
    var isAction = false;
    var maxL = 16;//最大长度
    var opArr = ['+', '-', '*', '/'];
    var opMap = {
        'plus': '+',
        'minus': '-',
        'mul': '*',
        'div': '/'
    }
    el.addEventListener('click', function(ev) {
        var curEl = ev.target;
        var val;
        var num;//数字
        var action;//操作
        var op;//运算符
        if (curEl.tagName =='LI') {
            val = curEl.getAttribute('data-val') || curEl.getAttribute('data-ac');
            if (isWrong) {
                if(['ce', 'cls'].indexOf(val) != -1) {
                    resetData();
                    expEl.innerHTML = '';
                    numEl.innerHTML = 0;
                } else {
                    return;
                }
            }
            num = parseInt(val);
            if (isDone) {
                isDone = false;
                if (!isNaN(num)) {//再次点击数字
                    resetData();
                } else if (val == 'dot') {
                    lastVal = 0;
                }
            }
            if ((!isNaN(num) || val == 'dot') && isAction) {
                isAction = false;
                lastVal = 0;
                numEl.innerHTML = 0;
            }
            if (!isNaN(num)) {//是数字
                var index = numEl.innerHTML.indexOf('.');
                if (isDot) {
                    if (index == -1) {
                        lastVal += num * 0.1 ;
                    } else {
                        lastVal = parseFloat(numEl.innerHTML + num);
                    }
                } else {
                    lastVal = lastVal * 10 + num;
                }
                numEl.innerHTML = lastVal;
                return;
            } else if (val == 'dot') {
                if (!isDot) {
                    isDot = true;
                    numEl.innerHTML = lastVal + '.';
                }
                return;
            }

            action = val;
            op = opMap[action];
            if (['del', 'ce', 'cls', 'eq'].indexOf(action) != -1) { //删除 清除 清空 等于
                if (action == 'cls') {
                    resetData();
                    expEl.innerHTML = '';
                    numEl.innerHTML = lastVal;
                } else if (action == 'del') {
                    var l = numEl.innerHTML.length;
                    numEl.innerHTML =  l > 1 ? numEl.innerHTML.substr(0, l - 1) : 0;
                    lastVal = parseFloat(numEl.innerHTML);
                    isDot = numEl.innerHTML.indexOf('.') != -1;
                } else if (action == 'ce') {
                    lastVal = 0;
                    numEl.innerHTML = lastVal;
                } else if(action == 'eq') {
                    isDone = true;
                    infix.push(lastVal);
                    infixToSuffix();
                    calcSuffix();
                    var re = result[0];
                    resetData();
                    lastVal = re;
                    expEl.innerHTML = '';
                    numEl.innerHTML = lastVal;
                }
                isAction = false;
            }  else if (['per', 'sqrt', 'plus-minus', 'frac'].indexOf(action) != -1) {//百分比、小数点、开方、 正负
                if (action == 'per') {
                    lastVal /= 100;
                } else if (action == 'sqrt') {
                    if (lastVal < 0) {
                        numEl.innerHTML = '无效输入';
                        return isWrong = true;
                    }
                    lastVal = Math.sqrt(lastVal);
                } else if (action == 'plus-minus') {
                    lastVal = -lastVal;
                } else if (action == 'frac') {
                    if (lastVal == 0) {
                        numEl.innerHTML = '除数不能为0';
                        return isWrong = true;
                    }
                    lastVal = 1 / lastVal;
                }
                numEl.innerHTML = lastVal;
                isAction = true;
            } else if (isOp(op)) {//运算符 + - * 、
                infix.push(lastVal);
                if (infix[infix.length - 2] == '/' && lastVal == 0) {
                    isWrong = true;
                    numEl.innerHTML = '除数不能为零';
                } else {
                    infixToSuffix();
                    numEl.innerHTML = calcSuffix();
                }
                infix.push(op);
                expEl.innerHTML = infix.join('');
                lastVal = 0;
                isAction = false;
            }

        }
    });

    /*构建中缀表达式*/
    function setInfix(val, type) {

    }

    /*后缀表达式计算*/
    function calcSuffix() {
        result = [];
        for(var i = 0; i < suffix.length; i++) {
            if (!isOp(suffix[i])) {//是数字
                result.push(suffix[i]);
            } else {
                result.push(getCalcResult(result.pop(), suffix[i], result.pop()));
            }
        }
        return result[0];
    }

    /*中缀表达式转后缀表达式*/
    function infixToSuffix() {
        var stack = [];//堆栈
        suffix = [];
        for(var i = 0; i < infix.length; i++) {
            if (!isOp(infix[i])) {//是数字
                suffix.push(infix[i]);
            } else {
                if (!stack.length) {
                    stack.unshift(infix[i]);
                } else {
                    var opTop = stack[0];
                    if (isPriorHigher(infix[i], opTop)) {//栈顶优先级更改出栈
                        while (stack.length && isPriorHigher(infix[i], opTop)) {
                            suffix.push(stack.shift());
                            opTop = stack[0];
                        }
                    }
                    stack.unshift(infix[i]);
                }
            }
        }
        while (stack.length) {
            suffix.push(stack.shift());
        }
    }

    /*重置*/
    function resetData() {
        infix = [];
        suffix = [];
        result = [];
        lastVal = 0;
        isDot = false;
        isWrong = false;
        isAction = false;
    }

    /*判断是否是运算符*/
    function isOp(op) {
        return op && opArr.indexOf(op) != -1;
    }

    /*判断优先级是否更高 第二个是否比第一个优先级高*/
    function isPriorHigher(a, b) {
        return (a == '+' || a == '-') && (b == '*' || b == '/');
    }

    /*获得计算结果*/
    function getCalcResult(a, op, b) {
        return op == '+' ? a + b
            : op == '-' ? a - b
            : op == '*' ? a * b
            : op == '/' ? a / b
            : '';
    }
}

