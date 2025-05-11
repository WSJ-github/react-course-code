import { setupTypeAcquisition } from '@typescript/ata'
import typescriprt from 'typescript';

/**自动获取类型定义 */
export function createATA(onDownloadFile: (code: string, path: string) => void) {
  // 这个函数启动类型获取，返回一个函数，然后你用这个函数传递应用程序的初始源代码。
  // 即传入代码，分析出其中需要的类型定义，并自动发送请求下载
  const ata = setupTypeAcquisition({
    projectName: 'my-ata',
    typescript: typescriprt, // 通过typescript获取类型
    logger: console,
    delegate: { // 代理
      receivedFile: (code, path) => {
        console.log('自动下载的包', path);
        // 下载完成后的回调，code对应下载的代码，path对应下载到本地的文件路径
        onDownloadFile(code, path);
      }
    },
  })

  return ata;
}
