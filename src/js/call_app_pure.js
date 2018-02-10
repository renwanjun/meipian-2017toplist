
var call_app_pure = (function(){
    var u = navigator.userAgent;
    var isAND = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; // 安卓
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    var isQQBrowser = u.indexOf('MQQBrowser') > -1;
    var isWX = u.indexOf('MicroMessenger') > -1;
    var from = getQueryString('from')
    var isAPP = from === 'appview' || from === 'appviewrcmd'

    function unescape(s) {
        while ((m = s.match(/&(amp|lt|gt|lrm|rlm|nbsp);/))) {
          s = s.replace(m[0], unescape1);
        }
        return s;
    }
    function getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')

        var r = window.location.search.substr(1).match(reg)

        if (r != null) {
            return unescape(r[2])
        }

        return null
    }

    function articleclick(id) {
        $.ajax({
            type: "get",
            url: window.location.origin + "/app/http/article_redirect.php?channel=column_topic&maskid=" + id,
        })

        callApp({
            type: 'article',
            id: id,
            weburl: window.location.origin + '/' + id,
            params: "from=callapp",
        })
    }

    function callappdownload(_ref) {
        var _ref$from = _ref.from,
            from = _ref$from === undefined ? '' : _ref$from,
            _ref$word = _ref.word,
            word = _ref$word === undefined ? '' : _ref$word,
            _ref$maskId = _ref.maskId,
            maskId = _ref$maskId === undefined ? '' : _ref$maskId;

        callApp({
            type: 'comment',
            id: maskId,
            weburl: window.location.origin + '/app/http/download.php',
            params: '' + (from ? 'from=' + from : '') + (word ? (from ? '&' : '') + 'word=' + word : '')
        });
    }

    function callApp(_ref2) {
        var _ref2$type = _ref2.type,
            type = _ref2$type === undefined ? '' : _ref2$type,
            _ref2$id = _ref2.id,
            id = _ref2$id === undefined ? '' : _ref2$id,
            _ref2$weburl = _ref2.weburl,
            weburl = _ref2$weburl === undefined ? '' : _ref2$weburl,
            _ref2$params = _ref2.params,
            params = _ref2$params === undefined ? '' : _ref2$params;
        // 类型 id 是否去应用宝
        if (id) {
            if (isAPP) {
                if (isIOS) {
                    var a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = weburl; //打开app
                    document.body.appendChild(a);
                    a.click();
                } else {
                    window.location.href = '' + weburl + (params ? '?' + params : '');
                }
            } else {
                if (isIOS) {
                    type = type === 'article' ? '' : type;

                    if (isQQBrowser || isWX) {
                        window.location.href = (window.location.host.indexOf('t-') > -1 ? 'https://t-a.meipian.cn' : 'https://a.meipian.cn') + (type ? '/' + type : '') + '/' + id; //  + (params ? '?' + params : '')
                    } else {
                        window.location.href = weburl
                    }
                } else if (isAND) {
                    if (isQQBrowser || isWX) {
                        if(getQueryString("v")){
                            var androidSchema = 'meipian://main.app/' + type + '/' + id;
                            window.location.href = window.location.origin + '/app/http/download.php?android_schema=' + androidSchema + '&v=' + getQueryString("v") + (params ? '&' + params : '');
                        }else{
                            window.location.href = '' + weburl + (params ? '?' + params : '');
                        }
                    } else {
                        window.location.href = '' + weburl + (params ? '?' + params : '');
                        // callAppIframe('meipian://main.app/' + type + '/' + id, '' + weburl + (params ? '?' + params : ''));
                    }
                } else {
                    window.location.href = '' + weburl + (params ? '?' + params : '');
                }
            }
        } else {
            window.location.href = '' + weburl + (params ? '?' + params : '');
        }
    }
    function callAppIframe(appurl, weburl) {
        var t = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 500;

        var start = new Date();

        var ifr = document.createElement('iframe');
        ifr.src = appurl; //打开app
        ifr.style.display = 'none';

        document.body.appendChild(ifr);

        setTimeout(function () {
            document.body.removeChild(ifr);
            var end = new Date(); //记录结束时间

            console.log(end - start);

            if (end - start <= t + 30) {
                //两者之差小于30ms时跳转到下载页
                window.location.href = weburl;
            }
        }, t);
    }

    function goArticle(mask_id) {
        if (window.webkit && window.webkit.messageHandlers) {
            window.webkit.messageHandlers.openArticle.postMessage(mask_id);
        } else if (window.android) {
            window.android.openArticle(mask_id);
        }
    }

    function goColumn(user_id) {
        if (window.webkit && window.webkit.messageHandlers) {
            window.webkit.messageHandlers.clickUser.postMessage(user_id);
        } else if (window.android) {
            window.android.clickUser(user_id);
        }
    }
  
    return {
       isAPP:isAPP,
       isWX:isWX, 
       callappdownload:callappdownload,
       goArticle:goArticle,
       goColumn:goColumn
    }
})();