(function (){
    /*1.渲染桌面*/
    setMAXID();
    autoPosition();

    /*2.渲染桌面底部任务栏*/
    renderTaskColumn();

    /*3.选框选择*/
    rectSelect();


    /*4.右键菜单*/
    document.addEventListener('contextmenu', function(ev) {
        var elInfo = getParentElInfo(ev.target, '_menuname', true);
        if (isObjNull(elInfo)) {
            createFirstMenu(elInfo.el, elInfo.name, ev);
        }
        ev.preventDefault();
    });

    /*5.鼠标单击*/
    document.addEventListener('click', function(ev) {
        removeMenu();
        if (ev.target.id != 'start'){
            document.querySelector('.start-menu-box').style.display = 'none';
        }
    });

    /*6.拖拽换图*/
    (function () {
        var switchEl = document.querySelector('.switchbg');
        var oriL = desk.clientWidth - 100;
        var oriT = -30;
        toOri();
        var arrBg =  ['img/bg/bg1.jpg', 'img/bg/bg2.jpg', 'img/bg/bg3.jpg', 'img/bg/bg4.jpg'];
        var selectIndex = 0;
        drag({
            el: switchEl,
            move: function(ev, dragNode) {
                if (dragNode) {
                    var top = css(dragNode, 'top');
                    if (top > 0) {
                        css(switchEl, 'top', 0);
                    }
                }
            },
            end: function(ev, dragNode) {
                toOri();
                selectIndex = (++selectIndex) % arrBg.length;
                desk.style.backgroundImage = 'url(' + arrBg[selectIndex] + ')';
            }
        });

        function toOri() {
            css(switchEl, 'left', oriL);
            css(switchEl, 'top', oriT);
        }
    })();

    /*7.开始菜单*/
    addShowEl({
        clickEl: document.querySelector('#start'),
        showEl: document.querySelector('.start-menu-box'),
        blockFn: function() {
            var tStart = document.querySelector('.t-start');
            css(tStart, 'zIndex', ZINDEX);
        }
    });

    /*8.计算器快捷方式*/
    var calc = document.querySelector('#calc');
    calc.addEventListener('click', function(ev){
        createCalculator();
    });

})();
