import * as path from "path";

export const log = (filename: string, name: string, data: any): string => {
  const cwd = process.cwd();
  const currentPath = filename
    .replace(path.dirname(cwd), "")
    .replace("user_code/lib", "");

  if (!process.env.NO_LOG) {
    console.log(currentPath, name);
    console.log(data);
  }

  return data;
};
