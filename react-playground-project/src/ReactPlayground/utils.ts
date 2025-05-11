import { strFromU8, strToU8, unzlibSync, zlibSync } from "fflate"
import { Files } from "./PlaygroundContext"
import JSZip from "jszip"
import { saveAs } from 'file-saver'

/**
 * 根据文件名获取语言（Monaco·Editor需要用）
 * @param name 文件全名
 * @returns 根据扩展名返回语言
 */
export const fileName2Language = (name: string) => {
    const suffix = name.split('.').pop() || ''
    if (['js', 'jsx'].includes(suffix)) return 'javascript'
    if (['ts', 'tsx'].includes(suffix)) return 'typescript'
    if (['json'].includes(suffix)) return 'json'
    if (['css'].includes(suffix)) return 'css'
    return 'javascript'
}


/**
 * 压缩字符串
 * 1. 将字符串转换为Uint8Array
 * 2. 使用zlib压缩
 * 3. 将压缩后的Uint8Array转换为字符串
 * 4. 将字符串转换为base64 ascii字符串
 * @param data 需要压缩的字符串（比如JSON.stringify(files)）
 * @returns 
 */
export function compress(data: string): string {
    const buffer = strToU8(data) // Converts a string into a Uint8Array for use with compression/decompression methods
    const zipped = zlibSync(buffer, { level: 9 }) // Compress data with Zlib, return Uint8Array
    const str = strFromU8(zipped, true) // Converts a Uint8Array to a string， return string
    return btoa(str) // Decodes a string into bytes using Latin-1 (ISO-8859), and encodes those bytes into a string using Base64.
}

/**
 * 解压base64字符串
 * @param base64 需要解压的base64字符串
 * @returns 解压后的字符串
 */
export function uncompress(base64: string): string {
    const binary = atob(base64)

    const buffer = strToU8(binary, true)
    const unzipped = unzlibSync(buffer)
    return strFromU8(unzipped)
}

/**
 * 压缩并下载文件（依赖JSZip & file-saver）
 * 1. 创建JSZip对象
 * 2. 遍历文件列表，将文件添加到JSZip对象中
 * 3. 生成blob对象
 * 4. 使用file-saver下载blob对象
 * @param files 文件列表
 */
export async function downloadFiles(files: Files) {
    const zip = new JSZip()

    Object.keys(files).forEach((name) => {
        zip.file(name, files[name].value)
    })
    
    const blob = await zip.generateAsync({ type: 'blob' })
    saveAs(blob, `code${Math.random().toString().slice(2, 8)}.zip`)
}
