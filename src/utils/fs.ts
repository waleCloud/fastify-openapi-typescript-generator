import fs from 'fs'
const { mkdir, stat } = fs.promises

export const isDirectory = (path: string) =>
    stat(path)
        .then(stats => stats.isDirectory())
        .catch(() => false)

export const mkdirIfNotExists = async (path: string) => {
    if (!(await isDirectory(path))) await mkdir(path, { recursive: true })
}
