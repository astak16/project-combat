import { Router, Request, Response, NextFunction } from "express";
import { DellAnalyer } from "./utils/dellAnalyzer";
import Crowller from "./utils/crowller";
import path from "path";
import fs from "fs";
import { getResponseData } from "./utils/util";

interface BodyRequest extends Request {
  body: {
    [key: string]: string | undefined;
  };
}

const checkLogin = (req: Request, res: Response, next: NextFunction) => {
  const isLogin = req.session ? req.session.login : false;
  if (isLogin) {
    next();
  } else {
    res.json(getResponseData(null, "请先登录"));
  }
};

const router = Router();

router.get("/", (req: BodyRequest, res: Response) => {
  const isLogin = req.session ? req.session.login : false;
  if (isLogin) {
    res.send(`
  <html>
    <body>
      <a href="/getdata">爬取内容</a>
      <a href="/showdata">展示内容</a>
      <a href="/logout">退出</a>
    </body>
  </html>
  `);
    return;
  }
  res.send(`
  <html>
    <body>
    <form method="post" action="/login">
      <input type="password" name="password"></input>
      <button>登录</button>
    </form>
    </body>
  </html>
  `);
});
router.get("/logout", (req: BodyRequest, res: Response) => {
  if (req.session) {
    req.session.login = undefined;
  }
  res.json(getResponseData(true));
});

router.get("/getData", checkLogin, (req: BodyRequest, res: Response) => {
  const secret = "secretKey";
  const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
  const analyzer = DellAnalyer.getInstance();
  new Crowller(url, analyzer);
  res.json(getResponseData(true));
});

router.get("/showData", checkLogin, (req: BodyRequest, res: Response) => {
  try {
    const position = path.resolve(__dirname, "../data/course.json");
    const result = fs.readFileSync(position, "utf-8");
    res.json(getResponseData(JSON.parse(result)));
  } catch (e) {
    res.json(getResponseData(false, "数据不存在"));
  }
});

router.post("/login", (req: BodyRequest, res: Response) => {
  const { password } = req.body;
  const isLogin = req.session ? req.session.login : undefined;
  if (isLogin) {
    res.json(getResponseData(false, "已经登录过"));
    return;
  }
  if (password === "123" && req.session) {
    req.session.login = true;
    res.json(getResponseData(true));
  } else {
    res.json(getResponseData(false, "登录失败"));
  }
});

export default router;
