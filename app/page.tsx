import Image from "next/image";
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

  const dirs = fs.readdirSync(dir);
  const folders = dirs.filter((file) => {
    return fs.statSync(`${dir}/${file}`).isDirectory();
  });
  const files = dirs.filter((file) => {
    return !fs.statSync(`${dir}/${file}`).isDirectory();
  });

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
async function getData() {
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

  const sandboxjs = fs.readFileSync("/var/task/sandbox.js", "utf8");
  const indexjs = fs.readFileSync("/var/task/index.js", "utf8");
  const osReleaseInfo = fs.readFileSync("/etc/os-release", "utf8");

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
    sandboxjs: sandboxjs,
    indexjs: indexjs,
    osReleaseInfo: osReleaseInfo,
  };
}

export default async function Home() {
  const {
    pwd,
    envs,
    fileTree,
    processes,
    text,
    fileTree2,
    cpu,
    totalMem,
    pwdWritable,
    user,
    df,
    fileTree3,
    platform,
    archi,
    ostype,
    osrelease,
    fileTree4,
    sandboxjs,
    indexjs,
    osReleaseInfo,
  } = await getData();

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <p className="text-6xl font-bold">CPU Cores: {cpu.length}</p>
      <p className="text-6xl font-bold">Total Memory: {totalMem}</p>
      <p className="text-6xl font-bold">PWD Writable: {pwdWritable}</p>
      <p className="text-6xl font-bold">User: {user.username}</p>
      <p className="text-6xl font-bold">pwd: {pwd}</p>
      <p className="text-6xl font-bold">text: {text}</p>
      <p>platform: {platform}</p>
      <p>archi: {archi}</p>
      <p>ostype: {ostype}</p>
      <p>osrelease: {osrelease}</p>
      <p>osReleaseInfo: {osReleaseInfo}</p>
      <p>
        {df.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </p>
      <p className="text-2xl">
        This is a starter template for Next.js + Vercel
      </p>
      <div className="flex flex-col items-center">
        <p className="text-2xl">The running processes are:</p>
        <pre>
          {processes.map((process) => (
            <p key={process} className="text-xl overflow-auto max-w-lg mb-3">
              {process}
            </p>
          ))}
        </pre>
      </div>
      <p className="text-2xl">The current working directory is: {pwd}</p>
      <div className="flex flex-col items-center">
        <p className="text-2xl">The environment variables are:</p>
        <pre>
          {Object.keys(envs).map((key) => (
            <p key={key} className="text-xl overflow-auto max-w-lg mb-3">
              {key}: {envs[key]}
            </p>
          ))}
        </pre>
      </div>
      <div className="flex flex-col items-center">
        <p className="text-2xl">The file tree is:</p>
        <pre>
          {fileTree.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </pre>
      </div>
      <div className="flex flex-col items-center">
        <p className="text-2xl">The file tree is:</p>
        <pre>
          {fileTree2.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </pre>
      </div>

      <div className="flex flex-col items-center">
        <p className="text-2xl">The file tree is:</p>
        <pre>
          {fileTree3.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </pre>
      </div>
      <div className="flex flex-col items-center">
        <p className="text-2xl">The file tree is:</p>
        <pre>
          {fileTree4.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </pre>
      </div>
      <div className="flex flex-col items-center">
        <p className="text-2xl">The content of sandbox.js is:</p>
        <pre>{sandboxjs}</pre>
      </div>
      <div className="flex flex-col items-center">
        <p className="text-2xl">The content of index.js is:</p>
        <pre>{indexjs}</pre>
      </div>
    </main>
  );
}
