import Image from "next/image";
import { getData } from "./../src/index";

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
  } = await getData(new Date().getTime());

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
