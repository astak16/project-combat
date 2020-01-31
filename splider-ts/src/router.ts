import { Router, Request, Response } from "express";
import { DellAnalyer } from "./dellAnalyzer";
import Crowller from "./crowller";

interface RequestWithBody extends Request{
  body: {
    [key: string]: string | undefined;
  };
}

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send(`
  <html>
    <body>
    <form method="post" action="/getData">
      <input type="password" name="password"></input>
      <button>提交</button>
    </form>
    </body>
  </html>
  `);
});

router.post("/getData", (req: RequestWithBody, res: Response) => {
  const { password } = req.body;
  if (password === "123") {
    const secret = "secretKey";
    const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
    const analyzer = DellAnalyer.getInstance();
    new Crowller(url, analyzer);

    res.send("success getData !");
  } else {
    res.send(`${req.teacherName} password Error`);
  }
});

export default router;
