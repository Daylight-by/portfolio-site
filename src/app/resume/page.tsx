import ResumeView from "./resume-view";
import { config } from "@/data/config";

export const metadata = {
  title: "简历 | " + config.author,
  description:
    config.author + " 的简历 —— " + config.role + "。技能、项目经历与学习方向。",
};

export default function ResumePage() {
  return <ResumeView />;
}
