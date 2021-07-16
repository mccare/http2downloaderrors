// This script is for testing aborting of long running http2 connections
// - start X long running HTTP2 downloads
// - then, each 2s start X HTTP2 downloads and kill them after 2s
// - repeat for 20 times
// - every non null exit code represents a finished request, meaning an error reported by the server or in the protocol
// - count and log those responses

const {spawn} = require('child_process')
const util = require('util')
const sleep = util.promisify(setTimeout)
let failureCounter = 0
const CURL_COMMAND = 'curl  -s --http2-prior-knowledge -w "%{http_code}" -o /dev/null --limit-rate 200k \'http://localhost:3000/\' '
const PARALLEL_REQUESTS = 2

async function main() {
    const childs = await startRequests(-1)
    await sleep(2000)
    for (let i = 0; i < 20; i++) {
        await startRequests(i, 2000)
    }

    console.log('Killing long running childs')
    childs.forEach(c => c.kill())
    console.log('Total failure counter is ', failureCounter)
}

async function startRequests(runLabel, sleepTime) {
    const childs = []
    const output = new Array(PARALLEL_REQUESTS)
    for (let i = 0; i < PARALLEL_REQUESTS; i++) {
        output[i] = []
    }
    console.log('Starting ' + PARALLEL_REQUESTS + ' requests')
    for (let i = 0; i < PARALLEL_REQUESTS; i++) {
        childs[i] = spawn(CURL_COMMAND, {shell: true})
        childs[i].stdout.on('data', data => {
            output[i].push('stdout: ' + data + '\n')
            console.log(`${runLabel} ${i} stdout:\n${data}`)
        })

        childs[i].stderr.on('data', data => {
            output[i].push('stderr: ' + data + '\n')
            console.error(`${runLabel} ${i} stderr: ${data}`)
        })

        childs[i].on('error', error => {
            output[i].push('error.message: ' + error.message + '\n')
            console.error(`${runLabel} ${i} error: ${error.message}`)
        })

        childs[i].on('close', code => {
            if (code != null) {
                failureCounter = failureCounter + 1
                console.log('Output was ', output[i].join('\n'))
                console.log(`${runLabel} ${i} child process exited with code ${code}`)
            }
        })
    }
    if (sleepTime) {
        console.log(runLabel + ' Waiting ... ' + sleepTime + ' seconds ')
        await sleep(sleepTime)
        console.log(runLabel + ' Killing ')
        childs.forEach(c => c.kill())
    } else {
        return childs
    }
}

main()
