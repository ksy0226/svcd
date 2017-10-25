'use strict';
var express = require('express');
var session = require('express-session');
var nodemailer = require('nodemailer');
var smtpPool = require('nodemailer-smtp-pool');
var config = require('../../config/config.json');
var logger = require('log4js').getLogger('app');

var sender = '서비스데스크 관리자 <servicedesk@isu.co.kr>';

module.exports = {

    mailSend: (req, res, next) => {

        var receiver = req.request_nm + " <" + req.request_id + ">";
        var mailTitle = "[서비스데스크 처리 완료] " + req.title;
        var html = "";
        html += "고객사명 : " + req.request_company_nm + "<br>";
        html += "요청자 : " + req.request_nm + "<br>";
        html += "완료요청일 : " + req.request_complete_date + "<br>";
        html += "<문의내용><br>";
        html += req.content + "<br>";
        html += "<br><hr><br>";
        html += "처리일자 : " + req.complete_date + "<br>";
        html += "처리담당자 : " + req.manager_nm + "<br>";
        html += "<처리내용><br>";
        html += req.complete_content + "<br>";
        html += "<br>";
        html += "더 자세한 내용은 서비스 데스크 게시판에서 확인 하세요.<br>";
        html += "서비스 데스크 ( https://helpdesk.isusystem.co.kr )<br>";
        html += "<br>";
        html += "※ 이 메일은 발신 전용입니다. 회신은 처리되지 않습니다.";

        var mailOptions = {
            from: sender,
            to: receiver,
            subject: mailTitle,
            html: html
        };

        var transporter = nodemailer.createTransport(smtpPool({
            service: config.mailer.service,
            host: config.mailer.host,
            port: config.mailer.port,
            auth: {
                user: config.mailer.user,
                pass: config.mailer.password
            },
            tls: {
                rejectUnauthorize: false
            },
            maxConnections: 5,
            maxMessages: 10
        }));

        transporter.sendMail(mailOptions, function (err, res) {
            if (err) {
                logger.debug('Nodemailer sendMail Failes >>>>>>>>>> ' + err)
            }
            transporter.close();
        });
    }
}