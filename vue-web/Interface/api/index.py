import re
import requests
import execjs
from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import urllib

class TranSlate:
    def __init__(self, query, mode='simple'):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36 Edg/97.0.1072.55',
            'Referer': 'https://fanyi.baidu.com/'
        }
        self.session = requests.Session()
        self.session.headers = self.headers
        self.transList = {
            'simple': ['zh en', 'en de', 'de zh'],
            'middle': ['zh en', 'en de', 'de jp', 'jp pt', 'pt zh'],
            'high': [
                'zh en',
                'en de',
                'de jp',
                'jp pt',
                'pt it',
                'it pl',
                'pl bul',
                'bul est',
                'est zh'
            ]
        }
        self.mode = mode
        self.query = query

    def get_token_gtk(self):
        url = "https://fanyi.baidu.com/"
        for i in range(3):
            response = self.session.get(url)
            token = re.findall("token: '(.*?)'", response.text)[0]
            gtk = re.findall("window.gtk = '(.*?)'", response.text)[0]
        return token, gtk

    def make_execjs_object(self):
        # file_ = os.getcwd() + '/sign.js'
        # print(file_)
        # with open(file_, 'r') as f:
        #     js = f.read()
        js = r'function n(r,o){for(var t=0;t<o.length-2;t+=3){var a=o.charAt(t+2);a=a>="a"?a.charCodeAt(0)-87:Number(a),a="+"===o.charAt(t+1)?r>>>a:r<<a,r="+"===o.charAt(t)?r+a&4294967295:r^a}return r}function e(r,gtk){var i=null;var o=r.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g);if(null===o){var t=r.length;t>30&&(r=""+r.substr(0,10)+r.substr(Math.floor(t/2)-5,10)+r.substr(-10,10))}else{for(var e=r.split(/[\uD800-\uDBFF][\uDC00-\uDFFF]/),C=0,h=e.length,f=[];h>C;C++){""!==e[C]&&f.push.apply(f,a(e[C].split(""))),C!==h-1&&f.push(o[C])}var g=f.length;g>30&&(r=f.slice(0,10).join("")+f.slice(Math.floor(g/2)-5,Math.floor(g/2)+5).join("")+f.slice(-10).join(""))}var u=void 0,l=""+String.fromCharCode(103)+String.fromCharCode(116)+String.fromCharCode(107);u=null!==i?i:(i=gtk||"")||"";for(var d=u.split("."),m=Number(d[0])||0,s=Number(d[1])||0,S=[],c=0,v=0;v<r.length;v++){var A=r.charCodeAt(v);128>A?S[c++]=A:(2048>A?S[c++]=A>>6|192:(55296===(64512&A)&&v+1<r.length&&56320===(64512&r.charCodeAt(v+1))?(A=65536+((1023&A)<<10)+(1023&r.charCodeAt(++v)),S[c++]=A>>18|240,S[c++]=A>>12&63|128):S[c++]=A>>12|224,S[c++]=A>>6&63|128),S[c++]=63&A|128)}for(var p=m,F=""+String.fromCharCode(43)+String.fromCharCode(45)+String.fromCharCode(97)+(""+String.fromCharCode(94)+String.fromCharCode(43)+String.fromCharCode(54)),D=""+String.fromCharCode(43)+String.fromCharCode(45)+String.fromCharCode(51)+(""+String.fromCharCode(94)+String.fromCharCode(43)+String.fromCharCode(98))+(""+String.fromCharCode(43)+String.fromCharCode(45)+String.fromCharCode(102)),b=0;b<S.length;b++){p+=S[b],p=n(p,F)}return p=n(p,D),p^=s,0>p&&(p=(2147483647&p)+2147483648),p%=1000000,p.toString()+"."+(p^m)};'
        return execjs.compile(js)

    def translate(self, query, fromF, toF):
        get_sign = self.make_execjs_object()
        token, gtk = self.get_token_gtk()
        while True:
            sign = get_sign.call('e', query, gtk)
            if sign:
                break
        url = f"https://fanyi.baidu.com/v2transapi?from={fromF}&to={toF}"
        form_data = {
            'form': fromF,
            'to': toF,
            'query': query,
            'transtype': 'translang',
            'simple_means_flag': '3',
            'sign': sign,
            'token': token,
            'domain': 'common'
        }
        response = self.session.post(url, data=form_data)
        result = re.findall('"dst":"(.*?)"', response.text)[0]
        return result

        # 设置语言转换的类型

    def setFromTo(self):
        query = self.query
        for index, item in enumerate(self.transList[self.mode]):
            # self.translate(self.query)
            Fromf = item.split(' ')[0]
            ToF = item.split(' ')[1]
            query = self.translate(query, Fromf, ToF)
        return query.encode('utf-8').decode("unicode_escape")


# 配置接口
class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        if '?' not in self.path:  # 如果带有参数
            self.wfile.write(json.dumps({'msg': '参数有误'}).encode('utf-8'))
            return
        else:
            self.queryString = urllib.parse.unquote(self.path.split('?', 1)[1])
            params = urllib.parse.parse_qs(self.queryString)
            print(params)
            query = params['query'][0]
            mode = params['mode'][0]
            data = TranSlate(query, mode).setFromTo()
            self.wfile.write(
                json.dumps({'msg': '查询成功', 'status_code': 1, 'data': data}, ensure_ascii=False).encode('utf-8'))
            return