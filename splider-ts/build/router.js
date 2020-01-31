"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var dellAnalyzer_1 = require("./dellAnalyzer");
var crowller_1 = __importDefault(require("./crowller"));
var router = express_1.Router();
router.get("/", function (req, res) {
    res.send("\n  <html>\n    <body>\n    <form method=\"post\" action=\"/getData\">\n      <input type=\"password\" name=\"password\"></input>\n      <button>\u63D0\u4EA4</button>\n    </form>\n    </body>\n  </html>\n  ");
});
router.post("/getData", function (req, res) {
    var password = req.body.password;
    if (password === "123") {
        var secret = "secretKey";
        var url = "http://www.dell-lee.com/typescript/demo.html?secret=" + secret;
        var analyzer = dellAnalyzer_1.DellAnalyer.getInstance();
        new crowller_1.default(url, analyzer);
        res.send("success getData !");
    }
    else {
        res.send(req.teacherName + " password Error");
    }
});
exports.default = router;
