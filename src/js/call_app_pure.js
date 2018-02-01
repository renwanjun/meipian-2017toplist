
var call_app_pure = (function () {
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
                        if (getQueryString("v")) {
                            var androidSchema = 'meipian://main.app/' + type + '/' + id;
                            window.location.href = window.location.origin + '/app/http/download.php?android_schema=' + androidSchema + '&v=' + getQueryString("v") + (params ? '&' + params : '');
                        } else {
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

    function isappInit() {
        var u = navigator.userAgent,
            version = getVersion();
        if (version && version >= 4.3) {
            try {
                var obj = {
                    title: '2017美篇年度影响力榜单',
                    desc: '2017美篇年度影响力榜单',
                    image: 'https://ss2.meipian.me/test/theme/v2/list/images/wx-share-icon.jpg',
                    url: window.location.href
                }
                if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
                    // ios
                    window.webkit.messageHandlers.shareWeb.postMessage(JSON.stringify(obj))

                } else if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
                    //安卓
                    window.android && window.android.shareWeb(JSON.stringify(obj))

                }
            } catch (e) {

            }
        }
    };

    function getVersion() {
        var agent = window.navigator.userAgent
        var type = "",
            version = 0,
            versionArr

        if (agent.indexOf('android') / 1 + 1) {
            type = 'android'
            var string = agent.slice(agent.indexOf('android/') + 'android/'.length)
            if (string.length > 0) {
                versionArr = string.split('.')
                version = versionArr.join("") / Math.pow(10, versionArr.length - 1)
            }
        } else if (agent.indexOf('ios') / 1 + 1) {
            type = 'ios'
            var string = agent.slice(agent.indexOf('ios/') + 'ios/'.length)
            if (string.length > 0) {
                versionArr = string.split('.')
                version = versionArr.join("") / Math.pow(10, versionArr.length - 1)
            }
        }

        return version
    }
    // function getappVersion() {
    //     //添加获取当前版本号
    //     $useragent = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : '';
    //     $version = '';
    //     $app_type = '';
    //     if (strstr($useragent, "android")) { // 获取客户端版本号
    //         $agent_array = explode("android/", $useragent);
    //         $version = isset($agent_array[1]) ? $agent_array[1] : '';
    //         $app_type = 'and';
    //     } else if (strstr($useragent, "ios")) {
    //         $agent_array = explode("ios/", $useragent);
    //         $version = isset($agent_array[1]) ? $agent_array[1] : '';
    //         $app_type = 'ios';
    //     }
    //     $version = explode(".", $version);
    //     $version = intval(isset($version[0]) ? $version[0] : '') + intval(isset($version[1]) ? $version[1] : '') / 10 + intval(isset($version[2]) ? $version[2] : '') / 100;
    // }

    return {
        isAPP: isAPP,
        isWX: isWX,
        callappdownload: callappdownload,
        goArticle: goArticle,
        goColumn: goColumn,
        isappInit: isappInit
    }
})();