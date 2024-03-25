import { readFile } from 'node:fs/promises'
// Esto solo en los modulos nativos que no tienen promesas nativas
// const { promisify } = require('node:util')
// const readFilePromise = promisify(fs.readFile)

console.log('Leyendo el primer archivo....')
const text = await readFile('./archivo.txt', 'utf-8')
console.log(text)
console.log('---> Hacer cosas mientras lee el archivo...')

console.log('Leyendo el segundo archivo....')
const secondText = await readFile('./archivo2.txt', 'utf-8')
console.log(secondText)
