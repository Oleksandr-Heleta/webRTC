const startButton = document.getElementById('start');
const recordButton = document.getElementById('record');
const playButton = document.getElementById('play');
const downloadButton = document.getElementById('download');
const screenButton = document.getElementById('screen');
const snapshotButton = document.getElementById('snapshot');

const gumVideo = document.querySelector('video#gum');
const recordedVideo = document.querySelector('video#recorded');
const canvas = document.querySelector('canvas');
const filterSelect = document.querySelector('select#filter');

let mediaRecorder;
let recordedBlobs;
//Download recorded stream
downloadButton.addEventListener('click', () =>{
    const buffer = new Blob(recordedBlobs, { type: "video/webm" });
    recordedVideo.src = window.URL.createObjectURL(buffer);
    console.log(recordedVideo.src);
    downloadButton.href = recordedVideo.src;
    downloadButton.download = "RecordedVideo.webm";
})

// Take snapshot and Filtered it
snapshotButton.addEventListener('click', () => {
    canvas.className = filterSelect.value;
    canvas.getContext('2d').drawImage(gumVideo, 0, 0, canvas.width, canvas.height);
})

filterSelect.addEventListener('change', () => {
    canvas.className = filterSelect.value;
})


// Play recorded stream
playButton.addEventListener('click', () => {
    const buffer = new Blob(recordedBlobs, {type: 'video/webm'});
    recordedVideo.src = window.URL.createObjectURL(buffer);
    recordedVideo.controls = true;
    recordedVideo.play();
})

const handleDataAvailable = (event) => {
    if(event.data) {
        recordedBlobs.push(event.data);
    }
}

const startRecording = () => {
    recordedBlobs = [];
    let options = {
        mimeType: 'video/webm; codecs=vp9, opus'
    }

    try {
        mediaRecorder = new MediaRecorder(window.stream, options);
    } catch (error) {
        console.error(error);
    }

    recordButton.textContent = 'Stop Recording';
    playButton.disabled = true;
    downloadButton.disabled = true;
    snapshotButton.disabled = false;

    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start();
}

const stopRecording = () => {
    recordButton.textContent = 'Record';
    playButton.disabled = false;
    downloadButton.disabled = false;
    mediaRecorder.stop();
}

// Record stream
recordButton.addEventListener('click', () => {
    if(recordButton.textContent === 'Record') {
        startRecording();
    } else {
        stopRecording();
    }
})

// Start stream
const handleSuccess = (stream) => {
    recordButton.disabled = false;
    snapshotButton.disabled = false;
    window.stream = stream;
    gumVideo.srcObject = stream;
}

const init = () => {
    const constraints = {
        video: {
            width: 1280,//{ min: 1024, ideal: 1280, max: 1920 },
            height: 720//{ min: 776, ideal: 720, max: 1080 }
        },
        audio: true
    }
    navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => handleSuccess(stream))
        .catch(error => console.error(error));
}

startButton.addEventListener('click', () => {
    if(startButton.innerText === 'Start camera') {
        startButton.innerText = 'Stop camera';
        init();
    } else {
        startButton.innerText = 'Start camera';
        recordButton.disabled = true;
        snapshotButton.disabled = true;
        playButton.disabled = true;
        downloadButton.disabled = true;
        gumVideo.srcObject = null;
        window.stream = null;
        recordedVideo.style.display = 'none';
        recordedVideo.src = null;
    }
})

// Screen Share
const initScreen = () => {
    const constraints = {
        video: {
            width: 1280,//{ min: 1024, ideal: 1280, max: 1920 },
            height: 720//{ min: 776, ideal: 720, max: 1080 }
        },
        audio: true
    }
    navigator.mediaDevices.getDisplayMedia(constraints)
        .then(stream => handleSuccess(stream))
        .catch(error => console.error(error));
}

screenButton.addEventListener('click', () => {
    if(screenButton.innerText === 'Share screen') {
        screenButton.innerText = 'Stop share';
        initScreen();
    } else {
        screenButton.innerText = 'Share screen';
        recordButton.disabled = true;
        snapshotButton.disabled = true;
        playButton.disabled = true;
        downloadButton.disabled = true;
        gumVideo.srcObject = null;
        window.stream = null;
        recordedVideo.style.display = 'none';
        recordedVideo.src = null;
    }
})