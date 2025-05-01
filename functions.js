// Store audio files
let audioFiles = [];

// Master tracks placeholder (will be populated from the database)
let masterTracks = [
  { name: "Track 1", id: 1 },
  { name: "Track 2", id: 2 }
];

// Upload Audio
function uploadAudio() {
  const fileInput = document.getElementById('audio-file');
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      const audioData = event.target.result;
      const audioName = file.name;

      // Store audio file data in array
      audioFiles.push({ name: audioName, data: audioData });

      // Display the uploaded audio in the list
      displayAudioList();
    };
    
    // Read file as data URL
    reader.readAsDataURL(file);
  } else {
    alert('Please select a file to upload');
  }

  // Clear input
  fileInput.value = '';
}

// Display audio list (for uploaded files in cache)
function displayAudioList() {
  const audioListElement = document.getElementById('audio-list');
  audioListElement.innerHTML = '';

  audioFiles.forEach((audio, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${audio.name}</span>
      <audio controls>
        <source src="${audio.data}" type="audio/mp3">
        Your browser does not support the audio element.
      </audio>
    `;
    audioListElement.appendChild(li);
  });
}

// DB Setup
let db;
const request = indexedDB.open("audioArchive", 1);

// Set up the database structure
request.onupgradeneeded = function (event) {
  db = event.target.result;
  const store = db.createObjectStore("audioFiles", { keyPath: "id", autoIncrement: true });
  store.createIndex("name", "name", { unique: false });
};

// Open the database
request.onsuccess = function (event) {
  db = event.target.result;
  console.log("Database opened successfully.");
  loadAudioFiles(); // Load files if any exist
};

// Upload Audio File to IndexedDB
function uploadAudio() {
  const fileInput = document.getElementById('audio-file');
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const audioData = event.target.result;
      const audioName = file.name;

      const transaction = db.transaction(["audioFiles"], "readwrite");
      const store = transaction.objectStore("audioFiles");

      const audioObject = { name: audioName, data: audioData };

      // Store the audio object
      const addRequest = store.add(audioObject);

      addRequest.onsuccess = function () {
        console.log("Audio file added to IndexedDB");
        loadAudioFiles(); // Refresh the list of audio files
      };

      addRequest.onerror = function () {
        console.log("Error adding audio file:", addRequest.error);
      };
    };

    reader.readAsDataURL(file); // Convert file to base64
  } else {
    alert("Please select a file to upload.");
  }

  // Clear input
  fileInput.value = '';
}

// Load all stored audio files from IndexedDB
function loadAudioFiles() {
  const audioListElement = document.getElementById('audio-list');
  audioListElement.innerHTML = ''; // Clear previous list

  const transaction = db.transaction(["audioFiles"], "readonly");
  const store = transaction.objectStore("audioFiles");

  const getAllRequest = store.getAll(); // Get all records

  getAllRequest.onsuccess = function () {
    const files = getAllRequest.result;

    // Add each audio file to the list
    files.forEach(file => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>${file.name}</span>
        <audio controls>
          <source src="${file.data}" type="audio/mp3">
          Your browser does not support the audio element.
        </audio>
      `;
      audioListElement.appendChild(li);
    });
  };

  getAllRequest.onerror = function () {
    console.log("Error loading audio files:", getAllRequest.error);
  };
}

// Delete an audio file from IndexedDB
function deleteAudio(fileId) {
  const transaction = db.transaction(["audioFiles"], "readwrite");
  const store = transaction.objectStore("audioFiles");

  const deleteRequest = store.delete(fileId);

  deleteRequest.onsuccess = function () {
    console.log("Audio file deleted");
    loadAudioFiles(); // Refresh the list after deletion
  };

  deleteRequest.onerror = function () {
    console.log("Error deleting audio file:", deleteRequest.error);
  };
}

// Delete all audio files from IndexedDB
function deleteAllAudio() {
  const transaction = db.transaction(["audioFiles"], "readwrite");
  const store = transaction.objectStore("audioFiles");

  const clearRequest = store.clear(); // This will remove all records from the store

  clearRequest.onsuccess = function () {
    console.log("All audio files deleted");
    loadAudioFiles(); // Refresh the list after deletion
  };

  clearRequest.onerror = function () {
    console.log("Error deleting all audio files:", clearRequest.error);
  };
}

// Display master tracks from the database (or placeholder)
function displayMasterTracks() {
  const masterTrackListElement = document.getElementById('master-track-list');
  masterTrackListElement.innerHTML = '';

  masterTracks.forEach(track => {
    const li = document.createElement('li');
    li.textContent = track.name;
    masterTrackListElement.appendChild(li);
  });
}

// Call to populate master tracks list
displayMasterTracks();


/*
//test code for carousel
const carousel-images = [
  https://i.postimg.cc/MpDsbBtQ/venue1.png" alt="Album Cover" class="round-button-img">
      "https://i.postimg.cc/fTYqyp95/venue2.png"
      "https://i.postimg.cc/MZCrWqvv/venue3.png"
      "https://i.postimg.cc/MpxPQ50w/venue4.png"
      "https://i.postimg.cc/G23q5m75/venue5.png"
];

let currentIndex = 0;
const newCarouselImage = document.getElementById("carousel-image");

function showNextImage() {
  currentIndex = (currentIndex + 1) % image.length;
  newCarouselImage.classList.remove("slide");
  void newCarouselImage.offsetWidth; // Restart animation
  newCarouselImage.src = image[currentIndex];
  newCarouselImage.classList.add("slide");
}

setInterval(showNextImage, 3000); // Change image every 3 seconds
*/