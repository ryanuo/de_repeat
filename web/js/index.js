var fromTextEle = $(".fromText"),
    toTextELe = $(".toText"),
    switchBtnEle = $(".switchBtn"),
    appid = "",
    key = "";
var transList = {
    simple: ["zh en", "en de", "de zh"],
    middle: ["zh en", "en de", "de jp", "jp pt", "pt zh"],
    high: [
        "zh en",
        "en de",
        "de jp",
        "jp pt",
        "pt it",
        "it pl",
        "pl bul",
        "bul est",
        "est zh",
    ],
};

var mode = "simple";
let status = localStorage.hasOwnProperty("appid")
if(status){
    $('.isStor').css("display","none")
    $(".clea").css("display","block")
}else{
    $('.isStor').css("display","flex")
    $(".clea").css("display","none")
}


// 生成API参数
function genParams(q, from, to) {
    var url = "//api.fanyi.baidu.com/api/trans/vip/translate";
    var data = {
        q: q,
        from: from,
        to: to,
        appid: appid,
        salt: "",
        sign: "",
    };

    data.salt = Math.floor(Math.random() * 10000000000);
    data.sign = md5(appid + q + data.salt + key);

    return { url, data };
}

// 翻译
function translate(q, from, to) {
    var params = genParams(q, from, to);
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: params.url,
            data: params.data,
            dataType: "jsonp",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            success: (res) => {
                log("from: " + from, "; ", "to:" + to);
                resolve(res);
            },
            error: () => {
                reject();
            },
        });
    });
}

// 翻译队列
function queen(str) {
    var dst = str;
    (async () => {
        for (let i = 0; i < transList[mode].length; i++) {
            var lang = transList[mode][i].split(" ");
            res = await translate(dst, lang[0], lang[1]);
            dst = res.trans_result[0].dst;
            log("result", dst);
        }
        toTextELe.val(dst);
    })();
}

// 开始翻译
function starSwitch() {
    status = localStorage.hasOwnProperty("appid")
    if (status) {
        let value = localStorage.getItem("appid");
        appid = JSON.parse(value).params
        key = JSON.parse(value).value
    } else {
        appid = $(".appid").val();
        key = $(".key").val();
        if (appid.length == 0 || key.length==0) {
            alert('请输入appid和key!!')
            return;
        } else {
            let data = {
                params: appid,
                value: key
            }
            localStorage.setItem("appid", JSON.stringify(data));
            $('.isStor').css("display","none")
            $(".clea").css("display","block")
            alert("appid已存储在缓冲中,如果需更换appid,请点击清除缓冲")
        }
    }
    if (fromTextEle.val() === "" || appid === "" || key === "") {
        return false;
    }
    mode = $(".level option:selected").val();
    queen(fromTextEle.val());
}

// 日志
function log(...params) {
    logEle = $(".log");
    // logEle.text("")
    var insertStr = params.join("");
    logEle.text(logEle.text() + insertStr + "\n");
}

// 清除缓冲
$(document).on('click', '#clear_storage', function () {
    let status = localStorage.hasOwnProperty("appid")
    if (status) {
        localStorage.removeItem("appid");
        $('.isStor').css("display","flex")
        $(".clea").css("display","none")
        alert("appid缓冲清除成功，请重新输入appid!!")
    }
})

$(".switchBtn").click(starSwitch);