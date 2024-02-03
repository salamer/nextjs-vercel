import Image from "next/image";
import fs from "fs";
import pslist from "ps-list";

const lookupDirectory = (dir: string, depth: number, depthEnd: number) => {
  if (depth > depthEnd) {
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

  for (const folder of folders) {
    res = res.concat(`Directory: ${dir}/${folder}`);
    res = res.concat(lookupDirectory(`${dir}/${folder}`, depth + 1, depthEnd));
  }

  for (const file of files) {
    res = res.concat(`File: ${dir}/${file}`);
  }
  return res;
};

const getAllRunningProcesses = async () => {
  const processes = await pslist();
  return processes.map((process) => `${process.name} - ${process.pid} - ${process.ppid} - ${process.cmd} - ${process.uid}`);
}

// This gets called on every request
async function getData() {
  const pwd = process.cwd();
  const envs = process.env;

  // write "hello world" to local file "text"
  fs.writeFileSync("text", "hello world");
  const fileTree = lookupDirectory("/tmp", 0, 2);
  const processes = await getAllRunningProcesses();

  return {
    pwd: pwd,
    envs: envs,
    fileTree: fileTree,
    processes: processes
  };
}

export default async function Home() {
  const { pwd, envs, fileTree, processes } = await getData();

  return (
    <main className="flex flex-col items-center justify-between p-24">
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
    </main>
  );
}
