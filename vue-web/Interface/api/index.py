#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @File  : a.py
# @Author: Harry
# @Date  : 31/3/2022
# @Desc  :
import re
import requests
import execjs
from http.server import  BaseHTTPRequestHandler
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
        with open("sign.js", 'r') as f:
            js = f.read()
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
    def _send_cors_headers(self):
        """ Sets headers required for CORS """
        self.send_header('Content-type', 'application/json')
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "*")
        self.send_header("Access-Control-Allow-Headers", "Authorization, Content-Type")

    def do_GET(self):
        self.send_response(200)
        self._send_cors_headers()
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