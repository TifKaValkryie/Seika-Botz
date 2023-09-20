// Base Create By Seika
"use strict"
console.log("⧎ Starting Script...")

import yargs from 'yargs'
import cfonts from "cfonts"
import { join, dirname } from 'path'
import { fileURLToPath } from "url"
import { createInterface } from "readline"
import { setupMaster, fork } from "cluster"
import { watchFile, unwatchFile } from "fs"

const { say } = cfonts
const rl = createInterface(process.stdin, process.stdout)
const __dirname = dirname(fileURLToPath(import.meta.url))

say("ChifuyuBotz -MD", {
font: "chrome",
align: "center",
gradient: ["blue", "green"] 
})
say("Script Ori ImYanXiao", {
font: "console", 
align: "center",
gradient: ["blue", "green"]
})

var isRunning = false

function startSeika(file) {
if (isRunning) return 
isRunning = true
let args = [join(__dirname, file), ...process.argv.slice(2)]

say([process.argv[0], ...args].join(" "), {
font: "console",
align: "center",
gradient: ["red", "magenta"]
})

setupMaster({
exec: args[0],
args: args.slice(1)
})

let p = fork()
p.on("message", data => {
console.log("[ ✅ RECEIVED ]", data)
switch (data) {
case "reset": 
p.process.kill()
isRunning = false
startSeika.apply(this, arguments)
break

case "uptime": 
p.send(process.uptime())
break
}
})
p.on("exit", (_, code) => {
isRunning = false
console.error("[❗] Exited With Code:", code)
if (code !== 0) return startSeika(file)
watchFile(args[0], () => {
unwatchFile(args[0])
startSeika(file)
})
})

let opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
if (!opts['test'])
if (!rl.listenerCount()) rl.on('line', line => {
p.emit('message', line.trim())
})
}
startSeika("main.js")