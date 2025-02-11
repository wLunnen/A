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
