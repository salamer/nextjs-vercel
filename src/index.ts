'use server'
import fs from "fs";
import pslist from "ps-list";
import os from "os";
import { exec } from "child_process";

const lookupDirectory = (dir: string, depth: number, depthEnd: number) => {
  if (depth > depthEnd) {
    return [];
  }

  if (dir.includes("node_modules")) {
    return [];
  }

  var files: string[] = [];
  var folders: string[] = [];

  try {
    const dirs = fs.readdirSync(dir);
    folders = dirs.filter((file) => {
      return fs.statSync(`${dir}/${file}`).isDirectory();
    });
    files = dirs.filter((file) => {
      return !fs.statSync(`${dir}/${file}`).isDirectory();
    });
  } catch (err) {
    return [];
  }

  let res: string[] = [];

  for (const file of files) {
    res = res.concat(`File: ${dir}/${file}`);
  }

  for (const folder of folders) {
    res = res.concat(`Directory: ${dir}/${folder}`);
    res = res.concat(lookupDirectory(`${dir}/${folder}`, depth + 1, depthEnd));
  }

  return res;
};

const getDF = () => {
  return new Promise((resolve, reject) => {
    exec("df -h", (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }
      if (stderr) {
        reject(stderr);
      }

      const lines = stdout.split("\n").filter(Boolean);

      resolve(lines);
    });
  });
};

const getAllRunningProcesses = async () => {
  const processes = await pslist();
  return processes.map(
    (process) =>
      `${process.name} - ${process.pid} - ${process.ppid} - ${process.cmd} - ${process.uid}`
  );
};

// This gets called on every request
export async function getData(x: number) {
  'use server'
  const pwd = process.cwd();
  const envs = process.env;

  // write "hello world" to local file "text"
  fs.writeFileSync("text", "hello world");
  // check if the file was written
  const text = fs.readFileSync("text", "utf8");

  const fileTree = lookupDirectory("/tmp", 0, 2);
  const fileTree2 = lookupDirectory(pwd, 0, 2);
  const fileTree3 = lookupDirectory("/vercel", 0, 2);
  const fileTree4 = lookupDirectory("/var", 0, 2);
  const processes = await getAllRunningProcesses();
  const cpu = os.cpus();
  const totalMem = os.totalmem();
  let pwdWritable = false;
  try {
    fs.accessSync(pwd, fs.constants.W_OK);
    pwdWritable = true;
  } catch (err) {
    pwdWritable = false;
  }
  const user = os.userInfo();
  const df = (await getDF()) as string[];
  const platform = os.platform();
  const archi = os.arch();
  const ostype = os.type();
  const osrelease = os.release();

  // const sandboxjs = fs.readFileSync("/var/task/sandbox.js", "utf8");
  // const indexjs = fs.readFileSync("/var/task/index.js", "utf8");
  // const osReleaseInfo = fs.readFileSync("/etc/os-release", "utf8");

  return {
    pwd: pwd,
    envs: envs,
    fileTree: fileTree,
    processes: processes,
    text: text,
    fileTree2: fileTree2,
    cpu: cpu,
    totalMem: totalMem,
    pwdWritable: pwdWritable,
    user: user,
    df: df,
    fileTree3: fileTree3,
    platform: platform,
    archi: archi,
    ostype: ostype,
    osrelease: osrelease,
    fileTree4: fileTree4,
    sandboxjs: "",
    indexjs: "",
    osReleaseInfo: "",
  };
}