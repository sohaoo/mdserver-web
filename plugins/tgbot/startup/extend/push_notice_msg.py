# coding:utf-8

import sys
import io
import os
import time
import re
import json
import base64
import threading

web_dir = os.getcwd() + "/web"
if os.path.exists(web_dir):
    sys.path.append(web_dir)
    os.chdir(web_dir)

import core.mw as mw

import telebot
from telebot import types
from telebot.util import quick_markup

# 轮播实例

chat_id = -1001578009023
# chat_id = 5568699210


def writeLog(log_str):
    if __name__ == "__main__":
        print(log_str)

    now = mw.getDateFromNow()
    log_file = mw.getServerDir() + '/tgbot/task.log'
    mw.writeFileLog(now + ':' + log_str, log_file, limit_size=5 * 1024)
    return True


def send_msg(bot, tag='ad', trigger_time=300):
    # 信号只在一个周期内执行一次|start
    lock_file = mw.getServerDir() + '/tgbot/lock.json'
    if not os.path.exists(lock_file):
        mw.writeFile(lock_file, '{}')

    lock_data = json.loads(mw.readFile(lock_file))
    if tag in lock_data:
        diff_time = time.time() - lock_data[tag]['do_time']
        if diff_time >= trigger_time:
            lock_data[tag]['do_time'] = time.time()
        else:
            return False, 0, 0
    else:
        lock_data[tag] = {'do_time': time.time()}
    mw.writeFile(lock_file, json.dumps(lock_data))
    # 信号只在一个周期内执行一次|end

    # 跨链混币器Cce.Cash💰低手续费💰隔断溯源 | 10/m | next,6/10 | @hu ge
    # TTKCDN | 10/m | @ssdpflood | 5
    # SJ资源网播放计费| 14/m | next,4/14 |@sjllzyw
    # https://t.me/gjgzs2022 ｜ 22/m | @GJ_gzs
    # 综合包网/NG接口开户 | 28/m | 6m | next,4/28 | x
    # 实名认证/过人脸🕵️‍♀️各种账号处理✅ | 30/m| next,6/30 | @nngzs
    # 桃花资源采集| 13/m| next,7/13 | @xiaolizi1122
    # D0抗投诉| 5/m | @lebo665544
    keyboard = [
        [
            types.InlineKeyboardButton(
                text="D0抗投诉微信支付宝不限行业支付", url='https://www.ymzf.org?mw')
        ],
        [
            types.InlineKeyboardButton(
                text="SJ资源网播放计费", url='https://sjzy.tv?mw')
        ],
        [
            types.InlineKeyboardButton(
                text="跨链混币器Cce.Cash💰低手续费💰隔断溯源", url='https://cce.cash/#/main/home?MW')
        ],
        [
            types.InlineKeyboardButton(
                text="桃花资源采集🚀 ", url='https://thzy.me')
        ],
        [
            types.InlineKeyboardButton(
                text="🚀 综合包网/NG接口开户", url='https://t.me/NG_Tony')
        ],
        [
            types.InlineKeyboardButton(
                text="实卡接码🙎‍♂️代实名/过人脸🅾️开飞机会员", url='https://t.me/gjgzs2022')
        ],
        # [
        #     types.InlineKeyboardButton(
        #         text="🚀腾云机场|解锁流媒体和ChatGPT", url='https://www.tencloud.net/index.php#/register?code=OGvXSTsc')
        # ],
        [
            types.InlineKeyboardButton(
                text="实名认证/过人脸🕵️‍♀️各种账号处理✅", url='https://t.me/niuniu234')
        ],
        [
            types.InlineKeyboardButton(
                text="官网", url='https://github.com/midoks/mdserver-web'),
            types.InlineKeyboardButton(
                text="💎DigitalVirt(赞助商)", url='https://digitalvirt.com/aff.php?aff=154')
        ],
        [
            types.InlineKeyboardButton(
                text="论坛", url='https://bbs.midoks.icu'),
            types.InlineKeyboardButton(
                text="搜索", url='https://bbs.midoks.icu/search.php'),
            types.InlineKeyboardButton(
                text="@ME", url='tg://user?id=5568699210'),
            types.InlineKeyboardButton(
                text="150RMB/月", url='tg://user?id=5568699210')
        ]
    ]
    markup = types.InlineKeyboardMarkup(keyboard)

    msg_notice = "由于在解决的问题的时候，不给信息，无法了解情况。以后不再群里回答技术问题。全部去论坛提问。在解决问题的过程中，可能需要面板信息，和SSH信息，如无法提供请不要提问。为了让群里都知晓。轮播一年！\n"
    msg_notice += "为了不打扰双方，私聊解决问题先转1000U，否则无视!\n"
    msg = bot.send_message(chat_id, msg_notice, reply_markup=markup)

    # print(msg.message_id)
    time.sleep(90)
    try:
        bot.delete_message(
            chat_id=chat_id, message_id=msg.message_id)
    except Exception as e:
        pass


def run(bot):
    try:
        send_msg(bot, 'notice_msg', 90)
    except Exception as e:
        writeLog('-----push_notice_msg error start -------')
        print(mw.getTracebackInfo())
        writeLog('-----push_notice_msg error start -------')
