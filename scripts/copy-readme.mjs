import { copyFile } from 'node:fs/promises'
import { basename } from 'node:path'
import { glob } from 'tinyglobby'

// console.log(process.cwd())

glob('README*.md').then((files) => {
  files.forEach((file) => {
    copyFile(file, `packages/unmini/${basename(file)}`)
  })
})
