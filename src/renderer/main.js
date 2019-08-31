import Vue from 'vue'

import App from './App'

const fs = require('fs')
const path = require('path')

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  template: '<App/>'
}).$mount('#app')

  // In the renderer process.
const { desktopCapturer, ipcRenderer } = require('electron')

desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
  for (const source of sources) {
    if (source.name === 'electron-vue') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
        	audio: {
        	  mandatory: {
        	    chromeMediaSource: 'desktop'
        	  }
        	},
        	video: {
        	  mandatory: {
        	    chromeMediaSource: 'desktop'
        	  }
        	}
        })
        handleStream(stream)
      } catch (e) {
        handleError(e)
      }
      return
    }
  }
})

function handleStream (stream) {
  // const video = document.querySelector('video')
  // video.srcObject = stream
  // video.onloadedmetadata = (e) => video.play()
  console.log('handle')
	console.log(stream)
 //  // 创建一个可写流
	// var writerStream = fs.createWriteStream('output.mp4');

	// URL.createObjectURL()

	// let video = document.querySelector('video')
	// console.log(URL)
	// for (let i in URL) {
	// 	console.log(i)
	// }
	// var blob = new Blob(stream);

	// var url = window.URL.createObjectURL(Blob)
	// localStream = stream
	// stream.onended = () => { console.log('Media stream ended.') }

	var chuncks = [];
	// var readStream = fs.createReadStream(url)
	// console.log(readStream)
	// readStream.pip(fs.createWriteStream('output.mp4'));
	// console.log(stream.pipe)
	var mediaRecorder = new MediaRecorder(stream);
	mediaRecorder.start();

	setInterval(() => {
		// mediaRecorder.stop();
		mediaRecorder.requestData();
		chuncks = []
		// mediaRecorder.start();
	}, 3000)

	var reader = new FileReader()
	mediaRecorder.ondataavailable = function(e) {
		console.log('data available')
		console.log(e)
	  // chuncks.push(e.data);
	  // console.log(chuncks)
		reader.onload = function() {
		    if (reader.readyState == 2) {
		        var buffer = new Buffer(reader.result)
		        ipcRenderer.send('blob', buffer)
		        // console.log(`Saving ${JSON.stringify({size: blob.size })}`)
		    }
		}
		reader.readAsArrayBuffer(e.data)
	}

	mediaRecorder.onstop = function(e) {


		console.log('record stop')
		var blob = new Blob(chuncks, { 'type' : 'audio/ogg; codecs=opus' });
		// let url = URL.createObjectURL(blob)


		let reader = new FileReader()
		reader.onload = function() {
		    if (reader.readyState == 2) {
		        var buffer = new Buffer(reader.result)
		        ipcRenderer.send('blob', buffer)
		        // console.log(`Saving ${JSON.stringify({size: blob.size })}`)
		    }
		}
		reader.readAsArrayBuffer(blob)



		// console.log(blob)
		// var readStream = fs.createReadStream(url)
		// console.log(readStream)
		// console.log(path.join(__dirname, 'output.mp4'))
		// readStream.pipe(fs.createWriteStream(path.join(__dirname, 'output.mp4')));
	}

	// setTimeout(() => {
	// 	console.log('stop')
	// 	mediaRecorder.stop()
	// }, 3000)

	// // 管道读写操作
	// // 读取 input.txt 文件内容，并将内容写入到 output.txt 文件中
	// // stream.pipe(writerStream);
	// writerStream.write(stream)

	// console.log('stream writed');

	// const mediaRecorder = new MediaRecorder(stream);
	// const data = [];
	
	// mediaRecorder.ondataavailable = e => e.data.size && data.push(e.data);
	// mediaRecorder.start();
	// process(data);
	
	// return mediaRecorder;
}

    function process(data) {
        const blob = new Blob(data);
        
        convertToArrayBuffer(blob)
            .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
            .then(play);
    }
    
    function convertToArrayBuffer(blob) {
        const url = URL.createObjectURL(blob);
        
        return fetch(url).then(response => {
            return response.arrayBuffer();
        });
    }

function handleError (e) {
	console.log('error')
  console.log(e)
  // console.log(e)
}
