import cheerio from "cheerio";
import fs from "fs";
import { Analyzer } from "./crowller";

interface Course {
  title: string;
  count: number;
}

interface CourseResult {
  time: number;
  data: Course[];
}

interface Content {
  [propName: number]: Course[];
}
class DellAnalyer implements Analyzer {
  private static instance: DellAnalyer;

  private constructor() {
    
  }

  static getInstance(){
    if (!DellAnalyer.instance) {
      DellAnalyer.instance = new DellAnalyer();
    }
    return DellAnalyer.instance;
  }

  private getCourseInfo(html: string) {
    const $ = cheerio.load(html);
    const courseItems = $(".course-item");
    const courseInfos: Course[] = [];
    courseItems.map((index, element) => {
      const descs = $(element).find(".course-desc");
      const title = descs.eq(0).text();
      const count = parseInt(
        descs
          .eq(1)
          .text()
          .split("：")[1],
        10
      );
      courseInfos.push({ title, count });
    });

    return {
      time: new Date().getTime(),
      data: courseInfos
    };
  }

  private geterateJsonContent(courseInfo: CourseResult, filePath: string) {
    let fileContent: Content = {};
    if (fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
    fileContent[courseInfo.time] = courseInfo.data;
    return fileContent;
  }

  public analyze(html: string, filePath: string) {
    const courseInfo = this.getCourseInfo(html);
    const fileContent = this.geterateJsonContent(courseInfo, filePath);
    return JSON.stringify(fileContent);
  }
}

export { DellAnalyer };
