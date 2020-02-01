import { Router, Request, Response } from "express";
import { DellAnalyer } from "./utils/dellAnalyzer";
import Crowller from "./utils/crowller";
import path from "path";
import fs from "fs";

interface BodyRequest extends Request {
  body: {
    [key: string]: string | undefined;
  };
}

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
  res.redirect("/");
});

router.get("/getData", (req: BodyRequest, res: Response) => {
  const isLogin = req.session ? req.session.login : false;
  if (isLogin) {
    const secret = "secretKey";
    const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
    const analyzer = DellAnalyer.getInstance();
    new Crowller(url, analyzer);

    res.send("success getData !");
  } else {
    res.send(`请登录`);
  }
});

router.get("/showData", (req: BodyRequest, res: Response) => {
  const isLogin = req.session ? req.session.login : false;
  if (!isLogin) {
    res.send("请登录后查看");
    return;
  }
  try {
    const position = path.resolve(__dirname, "../data/course.json");
    const result = fs.readFileSync(position, "utf-8");
    res.json(JSON.parse(result));
  } catch (e) {
    res.send("尚未爬取内容");
  }
});

router.post("/login", (req: BodyRequest, res: Response) => {
  const { password } = req.body;
  const isLogin = req.session ? req.session.login : undefined;
  if (isLogin) {
    res.send("已经登录");
    return;
  }
  if (password === "123" && req.session) {
    req.session.login = true;
    res.send("登录成功");
  } else {
    res.send("登录失败");
  }
});

export default router;
