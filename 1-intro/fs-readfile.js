const fs = require('node:fs') // A partir de node 16, se recomienda poner node:

// Forma sincrona
// console.log('Leyendo el primer archivo....')
// const text = fs.readFileASync('./archivo.txt', 'utf-8')

// console.log(text)
// console.log('Hacer cosas mientras lee el archivo...')

// console.log('Leyendo el segundo archivo....')
// const secondText = fs.readFileSync('./archivo2.txt', 'utf-8')
// console.log(secondText)

// Forma asincrona
console.log('Leyendo el primer archivo....')
fs.readFile('./archivo.txt', 'utf-8', (err, text) => {
  errorCheck(err)
  console.log(text)
})

console.log('---> Hacer cosas mientras lee el archivo...')

console.log('Leyendo el segundo archivo....')
fs.readFile('./archivo2.txt', 'utf-8', (err, text) => {
  errorCheck(err)
  console.log(text)
})

function errorCheck (error) {
  if (error) {
    console.error('No se pudo leer el archivo', error)
    process.exit(1)
  }
}
