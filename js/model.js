/**
 * 从当前元素开始查找指定属性
 * @param el 元素
 * @param attrName 自定义属性名
 * @param isUp 是否查找父级
 * @returns {{}} 查找到的元素, 元素自定义属性值
 */
function getParentElInfo(el, attrName, isUp) {
    if (!el) {
        return;
    }
    var name = el.getAttribute(attrName);
    var info = {};
    if (name) {
        info =  {
            'el': el,
            'name': name
        };
    } else if (el == document.body) {
        info = null;
    } else if (isUp) {
        info = getParentElInfo(el.parentNode, attrName, isUp);
    }
    return info;
}

/**
 * 从当前元素开始查找指定标签名
 * @param el 元素
 * @param attr 属性名
 * @param val 属性值
 * @param isUp 是否查找父级
 * @returns {*} 查找到的元素
 */
function getParentElByAttrAndVal(el, attr, val, isUp) {
    if (!el) {
        return;
    }
    var parent;
    if (el[attr] == val) {
        parent = el;
    } else if (el.parentNode == document.body) {
        parent = null;
    } else if(isUp) {
        parent = getParentElByAttrAndVal(el.parentNode, attr, val, isUp);
    }
    return parent;
}

/**
 * 生成元素
 * @param el 元素父级
 * @param tagName 元素标签名
 * @param target 元素属性
 * @param isBefore 是否添加到父级第一个
 * @returns {Element}  生产的元素
 */
function createTag(el, tagName, target, isBefore) {
    var  child= document.createElement(tagName);
    for (var i in target) {
        child[i] = target[i];
    }
    if (isBefore) {
        el.insertBefore(child, el.children[0]);
    } else {
        el.appendChild(child);
    }
    return child;
}

/**
 * 元素在页面中居中
 * @param oWindow 居中的元素
 */
function toCenter(oWindow) {
    css(oWindow, 'left', (window.innerWidth - oWindow.offsetWidth) / 2  + Math.random() * 50 );
    css(oWindow, 'top', (window.innerHeight - oWindow.offsetHeight) / 2 + Math.random() * 50);
}

/**
 * 为元素添加点击事件,显示或影藏另一个元素
 * @param init
 */
function addShowEl(init) {
    var clickEl = init.clickEl;
    var showEl = init.showEl;
    clickEl.addEventListener('click', function(ev) {
        if (showEl.style.display == 'none') {
            toShowEl(showEl, init.blockFn);
        } else {
            showEl.style.display = 'none';
        }
    });
}

/**
 * 显示某个元素
 * @param showEl 要显示的元素
 * @param blockFn 显示后的回调函数
 */
function toShowEl(showEl, blockFn) {
    css(showEl, 'zIndex', ++ZINDEX);
    showEl.style.display = 'block';
    blockFn && blockFn();
}

/*清除active样式和显示菜单*/
function clearActiveAndMenu() {
    removeMenu();
    clearActive();
}

/*移除菜单*/
function removeMenu() {
    var menuELs = document.querySelectorAll('.menu');
    menuELs.forEach(function(menu) {
        menu.parentNode.removeChild(menu);
    });
}

/*清除active样式*/
function clearActive() {
    var divs = document.querySelectorAll('.active');
    divs.forEach(function(node) {
        removeClassName(node, 'active');
    });
}

/**
 * 判断是否数组下是否有相同类型 且 相同名称的元素
 * @param dataList 查询的数组
 * @param name 名称
 * @param type 类型名
 * @returns {boolean} 是否重名
 */
function isRepeatByName(dataList, name, type) {
    var isRepeat = false;
    for(var i = 0; i < dataList.length; i++) {
        if (dataList[i].name == name && dataList[i].type == type) {
            isRepeat = true;
            break;
        }
    }
    return isRepeat;
}

/**
 * 判断是否数组（排查自身id）下是否有相同类型 且 相同名称的元素
 * @param dataList 查询数组
 * @param id 排查自身的id
 * @param name 相同名称
 * @param type 相同类型名
 * @returns {boolean}
 */
function isRepeatByIdAndName(dataList, id, name, type) {
    var isRepeat = false;
    for (var i = 0; i < dataList.length; i++) {
        if (dataList[i].id != id && dataList[i].name == name && dataList[i].type == type) {
            isRepeat = true;
            break;
        }
    }
    return isRepeat;
}

/*生成弹框*/
function createPop(init) {
    var item;
    if (init.pid) {
        item = getObjById(fileList, init.pid);
        init.typeName = item.type;
    }
    var type = typeList[init.typeName];
    var name = (init.pid ? item.name : type.name) + (init.suffix ? init.suffix : '');
    var pop = createTag(document.body, 'div', {className :'pop'});
    toShowEl(pop);
    var popWrap = createTag(pop, 'div', {className :'popWrap'});
    /*1.底部小图标 鼠标单击显示与影藏窗口*/
    createTkItem(pop, 'floder', name, type.icon);
    /*2.关闭框 缩小+放大+关闭*/
    var closeBox = createCloseBox(pop, popWrap, true, false);
    var title = createTag(closeBox, 'span', {className: 'title fl', innerHTML: name}, true);
    var pic = createTag(closeBox, 'img', {className: 'pic fl', src: type.icon}, true);
    init.createFn && init.createFn(pop, popWrap, type, item);
    /*3.窗口拖拽 改变位置*/
    dragWindow(pop, closeBox);
    toCenter(pop);
}

/**
 * 生成窗口
 * @param fPid 一级父级id
 * @param createFn 创建窗口主体回调函数
 * @param isIcon 窗口顶部左侧是否包含图标
 */
function createWindow(fPid, createFn, isIcon) {
    var oWindow = createTag(document.body, 'div', {className: 'window'});
    toShowEl(oWindow);
    var oWindowCont = createTag(oWindow, 'div', {className: 'window-cont'});
    /*1.底部小图标 鼠标单击显示与影藏窗口*/
    var item = getObjById(fileList, fPid);
    var tlItem = createTkItem(oWindow, item.type, item.name);
    /*2.关闭框缩小+放大+关闭*/
    var closeBox = createCloseBox(oWindow, oWindowCont, tlItem);
    if (isIcon) {
        var type = typeList[item.type];
        var title = createTag(closeBox, 'span', {className: 'title fl', innerHTML: item.name}, true);
        var pic = createTag(closeBox, 'img', {className: 'pic fl', src: type.icon}, true);
    }
    createFn && createFn(fPid, oWindow, oWindowCont);
    toCenter(oWindow);

    /*3.窗口拖拽 改变位置*/
    dragWindow(oWindow, closeBox, windowMove);
    /*4.窗口鼠标移动判定方向*/
    oWindow.addEventListener('mousemove', setDirect);
    /*5.窗口拖拽 改变大小*/
    dragResizeWindow(oWindow);
}

/**
 * 添加窗口方向的自定义属性
 * oWindow.direct 改变方向 eg:nw
 * oWindow.pos 上右下左是否满足添加  eg: 1000
 * oWindow.noResize 是否改变大小
 *
 * @param ev 事件对象
 */
function setDirect(ev) {
    var oWindow = this;
    var rect = oWindow.getBoundingClientRect();
    var top = ev.clientY < rect.top + 10 ? 1 : 0;
    var bottom = ev.clientY > rect.bottom - 10 ? 1 : 0;
    var left = ev.clientX < rect.left + 10 ? 1 : 0;
    var right = ev.clientX > rect.right - 10 ? 1 : 0;
    var directs = [
        {1: 'n', 0: ''}, {1: 's', 0: ''},
        {1: 'w', 0: ''}, {1: 'e', 0: ''}
    ];
    oWindow.direct = directs[0][top] + directs[1][bottom] + directs[2][left] + directs[3][right];
    oWindow.pos = [top, right, bottom, left].join('');
    if (ev.target == oWindow && (top || bottom || left || right)) {
        oWindow.noResize = false;
        oWindow.style.cssText += 'cursor: ' + oWindow.direct + '-resize;';
    } else {
        oWindow.noResize = true;
        if (ev.target.className == 'close-box') {
            oWindow.style.cssText += 'cursor: move;';
        } else {
            oWindow.style.cssText += 'cursor: default;';
        }
    }
}

/**
 * 创建窗口拖拽节点
 * @param oWindow 拖拽的窗口
 * @returns {Node} 拖拽节点
 */
function createWindowDragNode(oWindow) {
    var dragNode = oWindow.cloneNode(false);
    dragNode.className = 'window-div';
    oWindow.parentNode.appendChild(dragNode);
    setPosByAttribute(dragNode, oWindow);
    return dragNode;
}

/**
 * 移动位置到边界点改变大小
 * @param ev 事件对象
 * @param dragNode 拖拽节点
 * @param oWindow 原窗口
 */
function windowMove(ev, dragNode, oWindow) {
    var arr = [ev.clientX <= 5, ev.clientX >= desk.offsetWidth - 5, ev.clientY <= 0];
    if (arr.indexOf(true) != -1) {
        if (arr[0] || arr[2]) {
            css(dragNode, 'left', 0);
        } else if (arr[1]) {
            css(dragNode, 'left', desk.offsetWidth / 2);
        }
        css(dragNode, 'top', 0);
        css(dragNode, 'width', (arr[2] ? desk.offsetWidth : desk.offsetWidth / 2));
        css(dragNode, 'height', desk.offsetHeight);
    } else {
        css(dragNode, 'width', oWindow.iWidth);
        css(dragNode, 'height', oWindow.iHeight);
    }
}

/**
 * 窗口拖拽 改变位置
 * @param oWindow 窗口
 * @param closeBox 关闭栏
 * @param moveFn  移动回调函数
 */
function dragWindow(oWindow, closeBox, moveFn){
    setPosAttribute(oWindow, oWindow);
    drag({
        el: oWindow,
        isNoDrag: function(ev) {
            css(oWindow, 'zIndex', ++ZINDEX);
            if (ev.target != closeBox) {
                return true;
            }
        },
        createNode: function(ev) {
            return createWindowDragNode(this);
        },
        move: function(ev, dragNode) {
            dragNode && moveFn && moveFn(ev, dragNode, oWindow);
        },
        end: function(ev, dragNode) {
            if (dragNode) {
                setPosAttribute(dragNode, oWindow);
                setPosByAttribute(oWindow, oWindow);
                this.parentNode.removeChild(dragNode);
            }
        }
    });
}

/**
 * 拖拽改变窗口大小
 * @param oWindow 窗口元素
 */
function dragResizeWindow(oWindow) {
    var minH = 300;
    var minW = 400;
    drag({
        el: oWindow,
        isNoDrag: function(ev) {
            if (oWindow.noResize) {
                return true;
            }
            oWindow.removeEventListener('mousemove', setDirect);
        },
        createNode: function(ev) {
            return createWindowDragNode(this);
        },
        move: function(ev, dragNode, dis) {
            if (!dragNode) {
                return;
            }
            var rect = this.getBoundingClientRect();
            if (oWindow.direct.indexOf('n') != -1) {
                var iHeight = rect.bottom - (ev.clientY - dis.y);
                if (ev.clientY <= 0) {
                    css(dragNode, 'height', rect.bottom);
                    css(dragNode, 'top', 0);
                } else if (iHeight < minH) {
                    css(dragNode, 'height', minH);
                    css(dragNode, 'top', rect.bottom - minH);
                } else {
                    css(dragNode, 'height', iHeight);
                }
            } else if (oWindow.direct.indexOf('s') != -1) {
                var iHeight = (ev.clientY - dis.y + oWindow.iHeight) - rect.top;
                if (ev.clientY >= desk.clientHeight) {
                    css(dragNode, 'height', desk.clientHeight - rect.top);
                } else if (iHeight < minH) {
                    css(dragNode, 'height', minH);
                } else {
                    css(dragNode, 'height', iHeight);
                }
            }
            if (oWindow.direct.indexOf('w') != -1) {
                var iWidth = rect.right - (ev.clientX  - dis.x );
                if (ev.clientX <= 0) {
                    css(dragNode, 'width', rect.right);
                    css(dragNode, 'left', 0);
                } else if (iWidth < minW) {
                    css(dragNode, 'width', minW);
                    css(dragNode, 'left', rect.right - minW);
                } else {
                    css(dragNode, 'width', iWidth);
                }
            } else if (oWindow.direct.indexOf('e') != -1) {
                var iWidth = ev.clientX - dis.x + oWindow.iWidth - rect.left;
                if (iWidth > minW) {
                    css(dragNode, 'width', iWidth);
                } else {
                    css(dragNode, 'width', minW);
                }
            }

            if (oWindow.pos.charAt(3) == '0') {//左
                css(dragNode, 'left', rect.left);
            }
            if (oWindow.pos.charAt(0) == '0') {//上
                css(dragNode, 'top', rect.top);
            }
        },
        end: function(ev, dragNode) {
            if (dragNode) {
                setPosAttribute(dragNode, oWindow);
                setPosByAttribute(oWindow, oWindow);
                this.parentNode.removeChild(dragNode);
            }
            oWindow.addEventListener('mousemove', setDirect);
        }
    });
}

/**
 * 拖拽删除和移动文件夹
 * @param div 点击拖拽的元素
 * @param container 元素所在容器
 *
 */
function dragDelete(div) {
    drag({
        'el': div,
        'start': function (ev) {
            div.isActive = hasClassName(div, 'active');
        },
        'createNode': createNode,
        'move': function (ev, cloneNode) {
            if(cloneNode) {
                /*1.初始化信息*/
                if (!div.setInfo) {
                    div.setInfo = true;//是否初始化信息
                    div.cloneEls = [cloneNode];//克隆的节点数组
                    div.elIds = [div.getAttribute('_id')];//待删除节点id数组
                    div.isActive && createOthersClone();
                }
                removeClassName(div, 'hover');
                addClassName(div, 'active');
                /*2.修改其余克隆节点的位置*/
                div.isActive &&  dragOthersClone(cloneNode);
                /*3.获得碰撞元素*/
                gettargetEl(ev);
            }
        },
        'end': function(ev, cloneNode) {
            var container = div.parentNode;
            if (div.targetEl) {
                var id = div.targetEl.getAttribute('_id');
                var tObj = getObjById(fileList, id);
                console.log(tObj.type);
                if (!isConflict()) {
                    if (id == TRASHID) {
                        deleteFileAndRender(div.elIds, container);
                    } else if (['manage', 'floder'].indexOf(tObj.type) != -1) {
                        toFloder();
                    }
                }
                render(container, container.getAttribute('_id'));
            } else if (cloneNode) {
                if (container == desk) {
                    moveFile();
                }
                render(container, container.getAttribute('_id'));
            };
        }
    });

    /*移入到文件夹中*/
    function  toFloder() {
        var newPid = div.targetEl.getAttribute('_id');
        div.elIds.forEach(function(id) {
            var Obj = getObjById(fileList, id);
            toNewPlace(Obj, newPid);
        });
        renderAllcont();
    }

    /*创建克隆节点*/
    function createNode() {
        this.isOperate = true;//是否是操作元素
        var itemCloNode = this.cloneNode(true);
        itemCloNode.isOperate = true;
        css(itemCloNode, 'zIndex', ZINDEX + 1);
        css(itemCloNode, 'opacity', .3);
        removeClassName(itemCloNode, 'hover');
        removeClassName(itemCloNode, 'active');
        this.parentNode.appendChild(itemCloNode);
        return itemCloNode;
    }

    /*克隆其余节点*/
    function createOthersClone() {
        var others = div.parentNode.querySelectorAll('.active');
        others.forEach(function(node) {
            if (!node.isOperate) {
                var itemCloNode = createNode.call(node);
                itemCloNode.dis = {
                    x: node.offsetLeft - div.offsetLeft,
                    y: node.offsetTop - div.offsetTop,
                }
                itemCloNode.isClone = true;//是否是其他克隆元素
                div.cloneEls.push(itemCloNode);
                div.elIds.push(node.getAttribute('_id'));
            }
        });
    }

    /*改变其余其余克隆节点位置*/
    function dragOthersClone(cloneNode) {
        div.cloneEls.forEach(function(node) {
            if (node.isClone) {
                css(node, 'left', cloneNode.offsetLeft + node.dis.x);
                css(node, 'top', cloneNode.offsetTop + node.dis.y);
            }
        });
    }

    /*获取碰撞元素*/
    function gettargetEl(ev) {
        div.targetEl = null;
        var liEls =  div.parentNode.querySelectorAll('li');
        liEls.forEach(function(node) {
            if (!node.isOperate) {
                removeClassName(node, 'active');
                if(isInTarget(ev, node)) {
                    addClassName(node, 'active');
                    div.targetEl = node;
                }
            }
        });
    }

    /*是否冲突*/
    function isConflict() {
        var isConflict = false;//是否冲突
        for (var i = 0; i < div.elIds.length; i++) {
            if (deskUDIds.indexOf(div.elIds[i]) != -1) {
                isConflict = true;
                break;
            }
        }
        return isConflict;
    }

    /*移动元素*/
    function moveFile() {
        div.elIds.forEach(function(id, index) {
            var curObj = getObjById(fileList, id);
            curObj.left = div.cloneEls[index].offsetLeft;
            curObj.top = div.cloneEls[index].offsetTop;
        });
    }

}

/*选框选择*/
function rectSelect() {
    var parentEL;//元素父级
    var optEl;//操作的元素
    var rect;//选框
    var startMouse;//鼠标开始位置
    document.addEventListener('mousedown', function(ev) {
        var elInfo = getParentElInfo(ev.target, '_dragrect', false);
        if (isObjNull(elInfo)) {
            clearActive();
            optEl = elInfo.el;
            parentEL = optEl.parentNode;
            rect = null;
            startMouse = {
                x: ev.clientX,
                y: ev.clientY
            };
            document.addEventListener('mousemove', rectMove);
            document.addEventListener('mouseup', rectUp);
        }
        hiddenElement.focus();
        ev.preventDefault();
    });

    /*选框鼠标移动*/
    function rectMove(ev) {
        var endMouse = {
            x: ev.clientX,
            y: ev.clientY
        }
        /*是否创建选框*/
        if (!rect && (Math.abs(endMouse.x - startMouse.x) > 5
            || Math.abs(endMouse.y - startMouse.y)> 5)) {
            createRect(ev);
        }
        if (rect) {
            var parentRect = parentEL.getBoundingClientRect();
            if (endMouse.x < parentRect.left) {
                endMouse.x = parentRect.left;
            } else if (endMouse.x > parentRect.right) {
                endMouse.x = parentRect.right;
            }
            if (endMouse.y < parentRect.top) {
                endMouse.y = parentRect.top;
            } else if (endMouse.y > parentRect.bottom) {
                endMouse.y = parentRect.bottom;
            }
            var dis = {
                x: endMouse.x - startMouse.x,
                y: endMouse.y - startMouse.y
            }
            css(rect, 'width', Math.abs(dis.x));
            css(rect, 'height', Math.abs(dis.y));
            var now = {};
            now.x = dis.x < 0 ? endMouse.x : startMouse.x;
            now.y = dis.y < 0 ? endMouse.y : startMouse.y;
            css(rect, 'left', now.x - parentRect.left);
            css(rect, 'top', now.y - parentRect.top);
            setSelectEl();
        }
    }

    /*选框鼠标抬起*/
    function rectUp() {
        rect && parentEL.removeChild(rect);
        document.removeEventListener('mousemove', rectMove);
        document.removeEventListener('mouseup', rectUp);
    }

    /*创建选框*/
    function createRect(ev) {
        rect = createTag(parentEL, 'div', {className: 'drag-rect'});
        css(rect, 'zIndex', ++ZINDEX);
        css(rect, 'left', ev.clientX);
        css(rect, 'top', ev.clientY);
    }

    /*移动选中元素*/
    function setSelectEl() {
        var Els = optEl.querySelectorAll('li');
        Els.forEach(function(el) {
            removeClassName(el,'active');
            if (boom(rect, el)) {
                addClassName(el,'active');
            }
        });
    }
}

/**
 * 元素拖拽
 * @param init
 * init.el 操作的元素
 * init.isNoDrag 是否拖拽
 * init.start 鼠标按下回调函数
 * init.limit 拖拽的限制范围
 * init.createNode 拖拽解决创建函数，无则为init.el
 * init.move 鼠标移动回调函数
 * init.end 鼠标抬起回调函数
 */
function drag(init) {
    var el = init.el;//1.元素
    var dragNode;//拖拽的元素
    var startMouse;//鼠标开始位置
    var dis;//鼠标按下时距离
    var limit;//限定范围
    el.addEventListener('mousedown', function(ev) {
        if (!init.isNoDrag || !init.isNoDrag.call(el, ev)) {//2.是否进行拖拽
            dragNode = null;
            startMouse = {
                x: ev.clientX,
                y: ev.clientY
            }
            dis = {
                x: ev.clientX - el.offsetLeft,
                y: ev.clientY - el.offsetTop
            }
            init.start && init.start.call(el, ev);
            document.addEventListener('mousemove', dragMove);
            document.addEventListener('mouseup', dragUp);
            ev.preventDefault();
        }
    });
    function dragMove(ev) {
        if (!dragNode && (Math.abs(ev.clientX - startMouse.x) > 10
            || Math.abs(ev.clientY - startMouse.y) > 10) ) {
            limit = init.limit ? init.limit() : {
                minL: 0, maxL: window.innerWidth,
                minT: 0, maxT: window.innerHeight - 15
            };
            dragNode = init.createNode ? init.createNode.call(el, ev) : el;
        }
        if (dragNode) {
            var mouseEnd = {
                x: ev.clientX,
                y: ev.clientY
            }
            var now = {//当前位置
                x: mouseEnd.x - dis.x,
                y: mouseEnd.y - dis.y
            }
            /*限制范围*/
            if (now.x < limit.minL) {
                now.x = limit.minL;
            } else if (now.x > limit.maxL) {
                now.x = limit.maxL;
            }
            if (now.y < limit.minT) {
                now.y = limit.minT;
            } else if (now.y > limit.maxT) {
                now.y = limit.maxT;
            }
            css(dragNode, 'left', now.x);
            css(dragNode, 'top', now.y);
        }
        init.move && init.move.call(el, ev, dragNode, dis);
    }
    function dragUp(ev) {
        init.end && init.end.call(el, ev, dragNode);
        document.removeEventListener('mousemove', dragMove);
        document.removeEventListener('mouseup', dragUp);
    }
}

/**
 * 创建桌面菜单栏子项
 * @param el 子项对应的打开的窗口元素
 * @param typeName 类型名
 * @param name 子项名称
 */
function createTkItem(el, typeName, name, icon) {
    var taskInfo = taskList[typeName];
    if (!taskInfo) {
        taskInfo = taskList[typeName] = {
            list: []
        };
    }
    if(taskInfo.isShortcut) {
        taskInfo.isOpen = true;
        if (name) {
            taskInfo.list[0].name = name;
        }
    } else {
        taskInfo.list.push({
            showEl: el,
            icon: icon,
            name: name
        });
    }
    renderTaskColumn();
}

/**
 * 为元素添加鼠标移入和移出事件
 * @param li
 */
function setBaseFunc(li) {
    /*鼠标移出*/
    li.addEventListener('mouseover', function(ev) {
        if (!hasClassName(li, 'active')) {
            addClassName(li,'hover');
        }
    });
    /*鼠标移出*/
    li.addEventListener('mouseout', function(ev) {
        removeClassName(li,'hover');
    });

    /*鼠标单击*/
    li.addEventListener('click', function(ev) {
        clearActiveAndMenu();
        addClassName(li, 'active');
    });
}

/**
 * 生成窗口按钮
 * @param oWindow 操作的窗口元素
 * @param parent 要添加到哪个元素下
 * @param isShrink 是否有缩小按键
 * @param isMagify 是否有放大按键
 * @returns {Element}
 */
function createCloseBox(oWindow, parent, isShrink, isMagify) {
    var isNull = arguments.length == 3;
    var closeBox = createTag(parent, 'div', {className: 'close-box'});
    var div = createTag(closeBox, 'div', {className: 'fr'})
    /*缩小按钮*/
    if (isNull || isShrink) {
        var shrink = createTag(div, 'input', {type: 'button', className: 's-btn icon shrink'});
        shrinkClick(shrink, oWindow);
    }
    /*放大按钮*/
    if (isNull || isMagify) {
        var magify = createTag(div, 'input', {type: 'button', className: 's-btn icon magify'});
        magifyClick(magify, oWindow);
    }
    /*关闭按钮*/
    var close = createTag(div, 'input', {type: 'button', className: 's-btn icon close'});
    closeClick(close, oWindow);
    return closeBox;
}

/**
 * 为窗口关闭添加点击事件 窗口关闭
 * @param closeEl 关闭按钮
 * @param oWindow 窗口元素
 * @param closeFn 关闭回调函数
 */
function closeClick(closeEl, windowEl, closeFn) {
    closeEl.addEventListener('click', function() {
        var typeName = windowEl.getAttribute('typeName');
        var taskIndex = windowEl.getAttribute('taskIndex');
        var taskInfo = taskList[typeName];
        if (taskInfo.isShortcut) {
            windowEl.style.display = 'none';
            taskInfo.isOpen = false;
        } else {
            windowEl.parentNode.removeChild(windowEl);
            taskInfo.list.splice(taskIndex, 1);
        }
        closeFn && closeFn();
        renderTaskColumn();
    });
}

/**
 * 为缩小按键添加点击事件 窗口最小化
 * @param shrinkEl
 * @param oWindow
 */
function shrinkClick(shrinkEl, windowEl) {
    shrinkEl.addEventListener('click', function() {
        windowEl.style.display = 'none';
    });
}

/**
 * 为最大化按钮添加点击事件 窗口最大化
 * @param magifyEl 最大化的按钮
 * @param windowEl 设定的窗口元素
 */
function magifyClick(magifyEl, windowEl) {
    magifyEl.addEventListener('click', function() {
        if (windowEl.max) {
            windowEl.max = false;
            setPosByAttribute(windowEl, windowEl);
        } else {
            windowEl.max = true;
            css(windowEl, 'left', 0);
            css(windowEl, 'top', 0);
            css(windowEl, 'width', desk.offsetWidth);
            css(windowEl, 'height', desk.offsetHeight);
        }
    });
}

/**
 * 当前元素的四个自定义属性宽高left、top设定位目标元素的属性
 * @param target 目标元素
 * @param el 当前元素
 */
function setPosAttribute(target, el) {
    el.iLeft = target.offsetLeft;
    el.iTop = target.offsetTop;
    el.iWidth = target.offsetWidth;
    el.iHeight = target.offsetHeight;
}

/**
 * 元素的left top  宽高设定为目标元素的保存的四个自定义属性
 * @param el 元素
 * @param target 保存属性的目标元素
 */
function setPosByAttribute(el, target) {
    css(el, 'left', target.iLeft);
    css(el, 'top', target.iTop);
    css(el, 'width', target.iWidth);
    css(el, 'height', target.iHeight);
}

/**
 * 判断指定父级下是否包含指定类型
 * @param dataList 查询的数组
 * @param pid 父级id
 * @param fileType 类型名
 * @returns {*}
 */
function isHasFiletype(dataList, pid, fileType) {
    return dataList.find(function(item) {
        return item.pid == pid  && item.type == fileType;
    });
}

/**
 * 判断对象是否为空
 * @param el 对象
 * @returns {boolean} 是否为空 是为空
 */
function isObjNull(el) {
    if (!el) {
        return false;
    }
    var i = 0;
    for (var name in el) {
        i++;
    }
    return i > 0;
}

/**
 * 将时间戳改为分秒
 * @param timeStamp 时间戳
 * @returns {string}
 */
function getMinuteSecond(timeStamp){
    timeStamp = parseInt(timeStamp);
    return toTwo(parseInt(timeStamp / 60)) + ":"+ toTwo(timeStamp % 60);
}

/**
 * 将时间戳改为时分秒
 * @param timeStamp
 * @returns {string}
 */
function getHourMinuteSecond(timeStamp) {
    timeStamp = parseInt(timeStamp);
    return toTwo(parseInt(timeStamp / 60 /60)) + ":"+ toTwo(parseInt(timeStamp / 60)) + ":"+  toTwo(timeStamp % 60);
}

/**
 * 转换成2位的字符串
 * @param n 数字
 * @returns {string}
 */
function toTwo(n){
    return n < 10? '0' + n : '' + n;
}

/**
 * 判断鼠标位置是否在元素中
 * @param ev 事件对象
 * @param target 目标元素
 * @returns {boolean}
 */
function isInTarget(ev, target) {
    var reat2 = target.getBoundingClientRect();
    if ((ev.clientX >= reat2.left && ev.clientX <= reat2.right)
        && (ev.clientY >= reat2.top && ev.clientY <= reat2.bottom)) {
        return true;
    }
    return false;
}

/**
 * 判断元素是否碰撞
 * @param start 移动元素
 * @param target 目标元素
 * @returns {boolean} 移动元素是否与目标元素碰撞
 */
function boom(start, target) {
    var reat1 = start.getBoundingClientRect();
    var reat2 = target.getBoundingClientRect();
    if (reat1.left > reat2.right
        || reat1.right < reat2.left
        || reat1.top > reat2.bottom
        || reat1.bottom < reat2.top) {
        return false;
    }
    return true;
}

/**
 * 判断某个元素是否包含某个className
 * @param el 元素
 * @param className 类名
 * @returns {*|boolean}
 */
function hasClassName(el, className) {
    return el &&  el.className.indexOf(className) != -1;
}

/**
 * 为某个元素添加某个className
 * @param el 元素
 * @param className 类名
 */
function addClassName(el, className) {
    if (!hasClassName(el, className)) {
        el.className = el.className + ' ' + className;
    }
}

/**
 * 删除某个元素的某个className
 * @param el 元素
 * @param className 类名
 */
function removeClassName(el, className) {
    if (hasClassName(el, className)) {
        el.className = el.className.split(' ' + className).join('');
    }
}

var choice = 0;// 0=粘贴disable  1=复制 2=剪切
var repeatFiles = []; //复制或剪切的文件数组
var optContainer; //之前操作的容器


/**
 * 上传文件
 * @param ev 事件对象
 * @param info 信息
 * @param li 点击的右键菜单li
 */
function uploadFile(ev, info, li) {
    console.log('上传文件');
    var el = this;
    var inpEl = li.querySelector('input');
    inpEl.addEventListener('change', function(ev) {
        var file = inpEl.files[0];
        getUploadFile(el, file);
    });
}

/**
 * 获得上传文件
 * @param el 容器
 * @param file 上传的文件
 */
function getUploadFile(el, file) {
    var type = file.type.split('/')[0];
    var name = file.name.split('.')[0];
    var reader = new FileReader();
    reader.onload = function() {
        createUploadFile(el, reader.result, type, name);
    };
    if (type == 'text') {
        reader.readAsText(file, 'utf-8');
    } else {
        reader.readAsDataURL(file);
    }
}

/**
 * 新建上传文件
 * @param el 容器
 * @param dataUrl 上传的结果
 * @param filetype 文件类型
 * @param fileName 文件名
 */
function createUploadFile(el, dataUrl, filetype, fileName) {
    var data = {};
    data.pid = el.getAttribute('_id');
    data.id = ++MAXID;
    data.src = dataUrl;
    data.name = '上传' + fileName;
    data.type = typeList[filetype] ? filetype: 'unknow';
    if (el == desk) {//桌面文件
        var pos = getDeskPosition();
        data.left = pos.left;
        data.top = pos.top;
    }
    addNewData(data);
    render(el, data.pid);
}

/**
 * 新建文件
 * @param ev 事件对象
 * @param info 信息
 */
function createFile(ev, info) {
    var el = this;
    var type = typeList[info.type];
    var data = {};
    data.pid = el.getAttribute('_id');
    data.id = ++MAXID;
    data.type = info.type;
    data.name = '新建' + type.name;
    if (el == desk) {//桌面文件
        data.left = ev.clientX;
        data.top = ev.clientY;
    }
    addNewData(data);
    render(el, data.pid);
}

/**
 * 增加新数据
 * @param data 对象
 * @param suffix 名称后缀
 */
function addNewData(data, suffix) {
    suffix = suffix ? suffix : '';
    data.name = getFileName(fileList, data.pid, data.type, data.name + suffix);
    fileList.push(data);
}

/**
 * 获取新的文件名
 * @param dataList 数组
 * @param pid 父级id
 * @param typeName 类型名
 * @param basicName 默认名称
 * @returns {string}
 */
function getFileName(dataList, pid, typeName, basicName) {
    var dataList = getChildren(dataList, pid);
    if (!isRepeatByName(dataList, basicName, typeName)) {
        return basicName;
    }
    var num = 2;
    var fileName = basicName + '(' + num + ')';
    while(isRepeatByName(dataList, fileName, typeName)) {
        num ++;
        fileName = basicName + '(' + num + ')';
    }
    return fileName;
}

/*复制多个文件*/
function repeatFile() {
    repeatFileData(this, 1, true);
}

/*剪切多个文件*/
function cutFile() {
    repeatFileData(this, 2);
}

/**
 * 复制数据
 * @param el 右键菜单的对象
 * @param iChoice 剪切还是复制
 * @param isChild 是否获取子元素
 */
function repeatFileData(el, iChoice, isChild) {
    choice = iChoice;
    repeatFiles = [];
    var parentEl = el.parentNode;
    var arrEls = parentEl.querySelectorAll('.active');
    arrEls.forEach(function(el) {
        var id =  el.getAttribute('_id');
        repeatFiles.push(getObjById(fileList, id));
        if (isChild) {
            repeatFiles = repeatFiles.concat(getAllChildren(fileList, id));
        }
    });
    optContainer = parentEl;
}

/**
 * 粘贴文件
 * @param ev 事件对象
 * @param info
 */
function pasteFile(ev, info) {
    var funcs =  [toPasteRepeatFile, toPasteCutFile];
    var newPid = this.getAttribute('_id');
    funcs[choice - 1](repeatFiles, newPid, ev);
    if(choice == 2) {
        repeatFiles = [];
    }
    render(this, newPid);
    if (this != optContainer) {
        render(optContainer, optContainer.getAttribute('_id'));
    }
}

/**
 * 粘贴复制的文件
 * @param repeatFileList 复制的数组
 * @param newPid 新pid
 * @param ev 事件对象
 */
function toPasteRepeatFile(repeatFileList, newPid, ev) {
    var pid = newPid;
    var dataList = [];//复制过的对象数组
    repeatFileList.forEach(function(item) {
        var oriParent = getParentById(repeatFileList, item.id);
        if (oriParent) {//子集
            var newParent = getParentByOriId(dataList, oriParent.id);
            var newItem = returnNew(item, newParent.id);
            addNewData(newItem);
            dataList.push(newItem);
        } else {//第一级
            var newItem =  returnNew(item, pid);
            newItem.name += '-副本';
            if (newPid == 0) {
                var pos = getDeskPosition();
                newItem.left = pos.left;
                newItem.top = pos.top;
            }
            addNewData(newItem);
            dataList.push(newItem);
        }
    });
}

/**
 *
 * 粘贴剪切的文件
 * @param cutFileList 剪切的数组
 * @param newPid 新pid
 * @param ev 事件对象
 */
function toPasteCutFile(cutFileList, newPid, ev) {
    var prePid = cutFileList[0].pid;
    if (prePid == newPid) {
        return;
    } else if ([newPid].concat(getParentsId(fileList, newPid)).indexOf(prePid) != -1) {
        alert('不能剪切到子集！');
        return;
    }
    cutFileList.forEach(function(item) {
        toNewPlace(item, newPid);
    });
}


/*文件到新位置*/
function toNewPlace(item, newPid) {
    if (newPid == 0) {
        var pos = getDeskPosition();
        item.left = pos.left;
        item.top = pos.top;
    }
    item.oriPid = item.pid;
    item.name = getFileName(fileList, newPid, item.type, item.name);
    item.pid = newPid;
}

/*菜单还原文件*/
function restoreFile() {
    var ids = getSelectedIds(this);
    ids.forEach(function(id) {
        var item = getObjById(fileList,id);
        toNewPlace(item, item.oriPid);
    });
    render(desk, DESKID);
    renderAllcont();
}

/*还原回收站内所有文件*/
function restoreAllFile() {
    var children = getChildren(fileList, TRASHID);
    children.forEach(function(item) {
        toNewPlace(item, item.oriPid);
    });
    render(desk, DESKID);
    renderAllcont();
}

/*刷新*/
function refresh(ev, info) {
    render(this, this.getAttribute('_id'));
}

/**
 * 根据原Id查找元素
 * @param dataList 数组
 * @param oriId 原id
 * @returns {*}
 */
function getParentByOriId(dataList, oriId) {
    return dataList.find(function(item) {
        return item.oriId == oriId;
    });
}

/**
 * 返回新的对象
 * @param item 原对象
 * @param newPid 新对象的pid
 */
function returnNew(item, newPid) {
    var newItem = JSON.parse(JSON.stringify(item));
    newItem.oriId = newItem.id;
    newItem.oriPid = newItem.pid;
    newItem.id = ++MAXID;
    newItem.pid = newPid;
    return newItem;
}

/*修改文件名*/
function  reviseFileName(ev, info) {
    var el = this;
    var p = el.querySelector('p');
    p.style.display = 'none';
    var textarea = createTag(el, 'textarea', {value: p.innerHTML});
    textarea.focus();

    /*获得焦点*/
    textarea.addEventListener('mousedown', function(ev) {
        this.focus();
        ev.stopPropagation();
    });

    /*失去焦点*/
    textarea.addEventListener('blur', function(ev) {
        var id = el.getAttribute('_id');
        var curData = getObjById(fileList, id);
        var value = textarea.value.trim();
        /*1.为空*/
        if (value == '') {
            value = textarea.value = curData.name;
        }
        /*2.判断是否重名*/
        var dataList = getChildren(fileList, curData.pid);
        if (isRepeatByIdAndName(dataList, id,  value, curData.type)) {
            textarea.focus();
        } else {
            curData.name = textarea.value;
            p.innerHTML = textarea.value;
            el.removeChild(textarea);
            p.style.display = 'block';
        }
    });
}

/**
 * 获取容器中选中的id数组
 * @param container 容器
 * @returns {Array}
 */
function getSelectedIds(container) {
    var arrEls = container.parentNode.querySelectorAll('.active');
    var ids = [];
    arrEls.forEach(function(el) {
        ids.push(parseInt(el.getAttribute('_id')));
    });
    return ids;
}

/*菜单删除文件*/
function deleteFile() {
    deleteFileAndRender(getSelectedIds(this), this.parentNode);
}

/**
 * 删除文件并渲染当前容器
 * @param ids 删除id数组
 * @param container 容器
 */
function deleteFileAndRender(ids, container) {
    deleteFileDataByIds(ids);
    render(container, container.getAttribute('_id'));
    renderTrashCont();
}

/**
 * 删除多个文件数据
 * @param ids 删除的id数组
 */
function deleteFileDataByIds(ids) {
    ids.forEach(function(id) {
        var obj = getObjById(fileList, id);
        obj.oriPid = obj.pid;
        obj.pid = TRASHID;
    });
}

/*清空回收站*/
function clearTrash() {
    clearData(getChildren(fileList, TRASHID).map(function(item) {
        return item.id;
    }));
}

/*回收站内删除文件*/
function clearFile() {
    clearData(getSelectedIds(this));
}

/**
 * 清除数据
 * @param ids 清除的id数组
 */
function clearData(ids){
    var allIds = [];
    ids.forEach(function(id) {
        allIds.push(id);
        allIds = allIds.concat( getAllChildren(fileList, id).map( function (item) {
            return item.id;
        } ) );
    });
    fileList = fileList.filter(function (item) {
        return allIds.indexOf(item.id) == -1;
    });
    renderTrashCont();
}

/**
 * 根据id获取所有子集
 * @param dataList 数组
 * @param id 指定父级id
 * @returns {Array} 指定父级下的所有子集
 */
function getAllChildren(dataList, id) {
    var allChildren = [];
    allChildren = getChildren(dataList, id);
    allChildren.forEach(function(item) {
        var children = getAllChildren(dataList, item.id);
        allChildren = allChildren.concat(children);
    });
    return allChildren;
}

/**
 * 根据pid相同的数据
 * @param dataList 数组
 * @param pid 指定父级id
 * @returns {*}  指定父级下的一级子集
 */
function getChildren(dataList, pid) {
    if (!Array.isArray(dataList) || dataList.length == 0) {
        return [];
    }
    return dataList.filter(function(item) {
        return item.pid == pid;
    });
}

/**
 * 获取当前id的对象
 * @param dataList 数组
 * @param id 指定id
 * @returns {*} 指定id对应的对象
 */
function getObjById(dataList, id) {
    if (!Array.isArray(dataList) || dataList.length == 0) {
        return undefined;
    }
    return dataList.find(function(item) {
        return item.id == id;
    });
}

/**
 * 获取当前id的父级对象
 * @param dataList 数组
 * @param id  指定id
 * @returns {*} 直接父级
 */
function getParentById(dataList, id) {
    var cur = getObjById(dataList, id);
    return cur ? getObjById(dataList, cur.pid) : cur;
}

/**
 * 获取当前id的所有父级
 * @param dataList 数组
 * @param id 指定id
 * @returns {*} 指定id的所有父级
 */
function getParents(dataList, id) {
    var arr = [];
    var parent = getParentById(dataList, id);
    if (parent) {
        arr.push(parent);
        return getParents(dataList, parent.id).concat(arr);
    }
    return arr;
}


/**
 * 获取当前id所有父级的id数组
 * @param datalist 查询的数组
 * @param id id
 * @returns {*}
 */
function getParentsId(datalist, id) {
    var parents = getParents(datalist, id);
    return parents.map(function(item) {
        return item.id;
    });
}

/*MAXID初始化*/
function setMAXID() {
    MAXID = fileList.sort(function(a, b) {
        return a.id - b.id;
    })[fileList.length - 1].id;
}
