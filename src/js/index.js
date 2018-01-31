$(document).ready(function () {
    // var u = navigator.userAgent
    // // if (version && version < 4.3) {
    // var obj = {
    //     title: '我的美篇成长之旅',
    //     desc: desc,
    //     image: 'https://ss2.meipian.me/theme/v2/activity/my2017logo.png',
    //     url: window.location.href
    // }
    // if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
    //     // ios
    //     // window.android && window.android.sharePopup(JSON.stringify(obj))
    //     window.webkit.messageHandlers.sharePopup.postMessage(JSON.stringify(obj))
    // } else if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
    //     //安卓
    //     window.android && window.android.sharePopup(JSON.stringify(obj))
    // }
    $("img").click(function (evt) {
        evt.preventDefault();
    });
    $("img.lazy-load").lazyload({
        effect: "fadeIn", //渐现，show(直接显示),fadeIn(淡入),slideDown(下拉)
        threshold: 180, //预加载，在图片距离屏幕180px时提前载入
        // event: 'scroll',  // 事件触发时才加载，click(点击),mouseover(鼠标划过),sporty(运动的),默认为scroll（滑动）
        // container: $("#container"), // 指定对某容器中的图片实现效果
        'failure_limit': 2 //加载2张可见区域外的图片,lazyload默认在找到第一张不在可见区域里的图片时则不再继续加载,但当HTML容器混乱的时候可能出现可见区域内图片并没加载出来的情况
    });
    $("img.lazy-load").lazyload({
        effect: "fadeIn", //渐现，show(直接显示),fadeIn(淡入),slideDown(下拉)
        // threshold: 180, //预加载，在图片距离屏幕180px时提前载入
        event: 'click',  // 事件触发时才加载，click(点击),mouseover(鼠标划过),sporty(运动的),默认为scroll（滑动）
        container: $(".list"), // 指定对某容器中的图片实现效果
        // 'failure_limit':2 //加载2张可见区域外的图片,lazyload默认在找到第一张不在可见区域里的图片时则不再继续加载,但当HTML容器混乱的时候可能出现可见区域内图片并没加载出来的情况
    });


    $('a.goto-article,a.goto-column').click(function (evt) {
        evt.preventDefault();
        var href = $(this).attr('href').trim();
        var className = $(this).attr('class');
        
        // 判断是在浏览器中还是在app中
        if (!call_app_pure.isAPP) {
            window.location.href = href;
            return;
        }
       
        var endIndex = window.location.href.lastIndexOf('?')
        if (endIndex >= 0) {
            var u = window.navigator.userAgent,
                isWX = u.indexOf('MicroMessenger') > -1,
                isQQBrowser =u.toLowerCase().match(/QQ/i) == "qq",
                weiBo = u.toLowerCase().match(/WeiBo/i) == "weibo";
            // 在站外
            if (isWX || isQQBrowser || weiBo) {
                window.location.href = href;
            }
        }
        // 上线环境
        // var start=href.lastIndexOf('\/')+1,
        //     end=href.length-1;

        // if(className.indexOf('article')>=0){
        //     // href='https://t-www.meipian.cn/v8k1irx';
        //     var mask_id=href.substr(start,end);
        //     call_app_pure.goArticle(mask_id);
        // }else if(className.indexOf('column')>=0){
        //     // href='https://t-www.meipian.cn/c/15895943';
        //     var user_id=href.substr(start,end);
        //     call_app_pure.goColumn(user_id);
        // }

        // 测试环境
        var start = href.lastIndexOf('\/') + 1,
            end = href.length - 1;

        if (className.indexOf('article') >= 0) {
            href = 'https://t-www.meipian.cn/v8k1irx';
            var start = href.lastIndexOf('\/') + 1,
                end = href.length - 1;
            var mask_id = href.substr(start, end);
            call_app_pure.goArticle(mask_id);
        } else if (className.indexOf('column') >= 0) {
            href = 'https://t-www.meipian.cn/c/15895943';
            var start = href.lastIndexOf('\/') + 1,
                end = href.length - 1;
            var user_id = href.substr(start, end);
            call_app_pure.goColumn(user_id);
        }

        // var articleExp=/^https:\/\/www.meipian.cn\/([a-zA-Z\d]+)$/,
        //     authorExp=/^https:\/\/www.meipian.cn\/c\/([\d]+)$/
        // if(articleExp.test(href)){
        //     href='https://t-www.meipian.cn/v8k1irx';
        //     // var mask_id=href.match(articleExp)[1];
        //     call_app_pure.goArticle('v8k1irx');
        // }
        // if(authorExp.test(href)){
        //     href='https://t-www.meipian.cn/c/15895943';
        //     var user_id=href.match(authorExp)[1];
        //     call_app_pure.goColumn(authorExp);
        // }
        //console.log(articleExp.test(href))

        // var parentsClass=$(this).parents('.list').attr('class');
        // if(parentsClass.indexOf('influentialauthor')>=0 || parentsClass.indexOf('mpusers')>=0){
        //     window.location.href=href;
        // }else{
        //     window.location.href=call_app_pure.isApp?href:href+"?from=appviewrcmd";
        // }
    })

    // 在App内部显示，否则不显示
    if (call_app_pure.isAPP) {
        $('.footer').hide();
    }
    // 查看更多事件
    $('.readmore a').click(function () {
        $(this).parent().hide();
        $(this).parent().siblings().show();
    })

    // 导航切换点击事件
    $('.nav').on('click', 'span', function () {
        var href = $(this).attr('href');
        if (!/^\#/.test(href)) return;
        href = href.replace(/\#/, '').trim();
        var present = $(this).parent().attr('class');
        if (present.indexOf(href) >= 0) return;
        $(this).parent().attr('class', 'nav ' + href);

        // 标题切换 
        $(this).parent().next().children().hide();
        $(this).parent().next().children('.' + href).show();

        // 内容切换
        $(this).parent().siblings('.list').hide();

        var $next = $(this).parent().siblings('.list .list-' + href);
        $next.show();
        window.scrollTo(window.scrollX, window.scrollY + 2);

        // $("img.lazy-load").lazyload({
        //     effect: "fadeIn", //渐现，show(直接显示),fadeIn(淡入),slideDown(下拉)
        //     container: $next, // 指定对某容器中的图片实现效果
        // });
    
    });

    $('.footer').click(function () {
        call_app_pure.callappdownload({
            maskId: 'nocomment',
            from: 'toplist'
        });
    })
})