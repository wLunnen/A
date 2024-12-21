// Global array to store uploaded audio files
let audioFiles = [];

// Function to handle file upload
function uploadAudio() {
	const fileInput = document.getElementById("audio-upload");
	const file = fileInput.files[0];

	if (!file) {
		alert("Please select a file first.");
		return;
	}

	// Check if file is an audio file
	if (!file.type.startsWith("audio/")) {
		alert("Please upload an audio file.");
		return;
	}

	// Create an object URL for the audio file
	const audioURL = URL.createObjectURL(file);

	// Add the audio file to the list of audio files
	audioFiles.push({ name: file.name, url: audioURL });

	// Update the audio list on the page
	updateAudioList();

	// Reset the file input
	fileInput.value = "";
}

// Function to update the audio archive list
function updateAudioList() {
	const audioList = document.getElementById("audio-list");
	audioList.innerHTML = "";

	audioFiles.forEach((audio, index) => {
		const li = document.createElement("li");
		li.textContent = audio.name;
		li.onclick = () => playAudio(audio.url);

		audioList.appendChild(li);
	});
}

// Function to play selected audio file
function playAudio(audioURL) {
	const audioPlayer = document.getElementById("audio-player");
	const audioSource = document.getElementById("audio-source");
	audioSource.src = audioURL;
	audioPlayer.load();
	audioPlayer.play();
}
