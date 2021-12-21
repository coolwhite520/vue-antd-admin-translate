/// <reference path="../../types/index.d.ts" />
const neffos = require('neffos.js');
// const stdin = process.openStdin();

const wsURL = "ws://localhost:7777/upload";

async function runExample() {
    try {
        const conn = await neffos.dial(wsURL, {
            default: { // "default" namespace.
                _OnNamespaceConnected: function (nsConn, msg) {
                    if (nsConn.conn.wasReconnected()) {
                        console.log("re-connected after " + nsConn.conn.reconnectTries.toString() + " trie(s)");
                    }
                    console.log("connected to namespace: " + msg.Namespace);
                },
                _OnNamespaceDisconnect: function (nsConn, msg) {
                    console.log("disconnected from namespace: " + msg.Namespace);
                },
                NewFile: function (nsConn, msg) { // "chat" event.
                    console.log(msg.Body);
                },
                WriteFile: function (nsConn, msg) { // "chat" event.
                    console.log(msg.Body);
                },
                CloseFile: function (nsConn, msg) { // "chat" event.
                    console.log(msg.Body);
                }
            }
        }, { // optional.
            reconnect: 2000,
            // set custom headers.
            headers: {
                // 'X-Username': 'kataras',
            }
        });
        const fs = require("fs")
        const nsConn = await conn.connect("default");
        // nsConn.emit("File", "Hello from client side!");
        let reqObj = {
            file_name: "a.epub",
            data: [],
        }
        nsConn.emit("NewFile", JSON.stringify(reqObj));

        const readstream = fs.createReadStream('/Users/baiyang/Desktop/a.epub');
        readstream.on('data', (chunk) => {
            nsConn.emit("WriteFile", chunk.toString("base64"));

        });
        readstream.on('close', () => {
            nsConn.emit("CloseFile", JSON.stringify(reqObj));
        });
        // stdin.addListener("data", function (data) {
        //     nsConn.emit("File", data.toString().trim());
        // });

    } catch (err) {
        console.error(err);
    }
}

runExample();

setTimeout(()=> {
    console.log("over")
}, 100000)
