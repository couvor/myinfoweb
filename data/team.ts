// 团队成员数据：首页「创始团队」名单与个人主页（mingyanginfo.com/{slug}）共用同一来源
// ※ bio / intro 均为占位内容——把真实照片按同名放入 public/team/ 覆盖即可，文字直接改引号内
export type TeamPerson = {
  name: string;
  latin: string; // 拉丁名（Instrument Serif 斜体装饰用）
  slug: string; // 个人主页路径：/{slug}，如羿德钰 → /ydy
  photo: string; // public/team/拼音.png
  role: string;
  school: string;
  bio: string; // 一句话简介（首页浮窗用）
  intro: string; // 个人主页简介段
};

export const team: TeamPerson[] = [
  {
    name: "周高凡",
    latin: "Zhou Gaofan",
    slug: "zgf",
    photo: "/team/zhou-gaofan.png",
    role: "创始人 · 法人及总经理",
    school: "华侨大学土木工程学院",
    bio: "公司创始人，负责公司整体战略与产品方向。", // 占位简介，待替换
    intro:
      "公司创始人，负责公司整体战略与产品方向。围绕软件供应链安全与教育辅助两条产品线，持续推动明旸信息从技术能力走向可信产品。",
  },
  {
    name: "羿德钰",
    latin: "Yi Deyu",
    slug: "ydy",
    photo: "/team/yi-deyu.png",
    role: "财务",
    school: "西安邮电大学计算机学院",
    bio: "负责公司财务管理与运营支持。", // 占位简介，待替换
    intro:
      "负责公司财务管理与运营支持，以稳健的财务规划保障研发投入与经营目标之间的长期匹配。",
  },
  {
    name: "张明旸",
    latin: "Zhang Mingyang",
    slug: "zmy",
    photo: "/team/zhang-mingyang.png",
    role: "研发人员",
    school: "西北工业大学动力与能源学院",
    bio: "负责核心产品研发工作。", // 占位简介，待替换
    intro:
      "负责核心产品研发工作，聚焦 AI 驱动的软件供应链安全检测能力，把检测引擎打磨为可信、可用的工程工具。",
  },
  {
    name: "刘浩",
    latin: "Liu Hao",
    slug: "lh",
    photo: "/team/liu-hao.png",
    role: "研发人员",
    school: "西安电子科技大学计算机学院",
    bio: "负责核心产品研发工作。", // 占位简介，待替换
    intro:
      "负责核心产品研发工作，关注系统架构与工程实践，保障产品在真实环境中的稳定与高效。",
  },
  {
    name: "谈宇森",
    latin: "Tan Yusen",
    slug: "tys",
    photo: "/team/tan-yusen.png",
    role: "研发人员",
    school: "西安理工大学水利水电学院",
    bio: "负责核心产品研发工作。", // 占位简介，待替换
    intro:
      "负责核心产品研发工作，参与产品从设计、实现到上线的完整工程链路。",
  },
  {
    name: "欧阳兆秦",
    latin: "Ouyang Zhaoqin",
    slug: "oyzq",
    photo: "/team/ouyang-zhaoqin.png",
    role: "研发人员",
    school: "浙江大学信息与电子工程学院",
    bio: "负责核心产品研发工作。", // 占位简介，待替换
    intro:
      "负责核心产品研发工作，聚焦检测引擎与数据服务能力建设，支撑供应链透明度的持续演进。",
  },
  {
    name: "汪桠然",
    latin: "Wang Yaran",
    slug: "wyr",
    photo: "/team/wang-yaran.png",
    role: "产品经理",
    school: "西北大学",
    bio: "负责产品规划与设计工作。", // 占位简介，待替换
    intro:
      "负责产品规划与需求设计，将技术能力转化为贴合真实场景的产品形态。",
  },
  {
    name: "尹梓旭",
    latin: "Yin Zixu",
    slug: "yzx",
    photo: "/team/yin-zixu.png",
    role: "产品经理",
    school: "陕西师范大学",
    bio: "负责产品规划与设计工作。", // 占位简介，待替换
    intro:
      "负责产品规划与需求设计，连接用户场景与产品迭代节奏，让每一次交付都回应真实需求。",
  },
  {
    name: "陈镜宇",
    latin: "Chen Jingyu",
    slug: "cjy",
    photo: "/team/chen-jingyu.png",
    role: "技术顾问",
    school: "西安邮电大学",
    bio: "负责技术方向咨询与方案指导。", // 占位简介，待替换
    intro:
      "作为技术顾问，为公司提供技术方向咨询与架构建议，参与关键技术方案的评审与把关。",
  },
];
