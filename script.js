let model;
const video = document.getElementById('webcam');

// Initialize the webcam stream
async function setupWebcam() {
  return new Promise((resolve, reject) => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        video.srcObject = stream;
        video.addEventListener('loadeddata', () => resolve(video));
      })
      .catch(err => reject(err));
  });
}

// Load the handpose model
async function loadHandPoseModel() {
  model = await handpose.load();
  console.log("Handpose model loaded.");
  detectHands();
}

// Detect hand landmarks in the video frame
async function detectHands() {
  const predictions = await model.estimateHands(video);
  if (predictions.length > 0) {
    const hand = predictions[0];
    const landmarks = hand.landmarks;

    // Detect hand gestures: Check y-coordinates of fingertips
    const [thumb, indexFinger] = [landmarks[4], landmarks[8]]; // Thumb and index fingertips

    if (indexFinger[1] < thumb[1]) {
      window.scrollBy(0, -10); // Scroll up
    } else {
      window.scrollBy(0, 10); // Scroll down
    }
  }
  requestAnimationFrame(detectHands);
}

// Initialize everything
setupWebcam()
  .then(loadHandPoseModel)
  .catch(err => console.error("Webcam access denied:", err));
