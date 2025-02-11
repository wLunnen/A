// Store audio files
let audioFiles = [];

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




//DB 


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

request.onerror = function (event) {
  console.log("Database error:", event.target.errorCode);
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

// Load all stored audio files
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


