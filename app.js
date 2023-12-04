document.addEventListener('DOMContentLoaded', function () {
    // Initial video source
    const defaultVideoSource = "video1.mp4";
    loadVideo(defaultVideoSource);
});

function loadSelectedVideo() {
    var videoSelector = document.getElementById("videoSelector");
    var selectedVideo = videoSelector.options[videoSelector.selectedIndex].value;
    loadVideo(selectedVideo);
}

function loadVideo(source) {
    const video = document.getElementById('video');
    video.innerHTML = ''; // Clear previous source
    const sourceElement = document.createElement('source');
    sourceElement.src = "videos/" + source;
    sourceElement.type = 'video/mp4';
    video.appendChild(sourceElement);

    // Load corresponding caption file
    loadCaptions(source);
}

function loadCaptions(videoSource) {
    // Fetch the SRT file content
    fetch("captions/captions.srt")
        .then(response => response.text())
        .then(data => {
            console.log("SRT File Content:", data);
            const captionsData = parseSrt(data);
            updateCaptionDisplay(captionsData);
        })
        .catch(error => {
            console.error("Error loading captions:", error);
        });
}

function parseSrt(srtContent) {
    const captionBlocks = srtContent.split(/\n\s*\n/);

    return captionBlocks.map(block => {
        const lines = block.trim().split('\n');

        // Ensure there are enough lines to parse
        if (lines.length >= 3) {
            const timestamp = lines[1].trim().replace(/,/g, '.');
            const word = lines.slice(2).join('\n').trim(); // Preserve line breaks
            return { timestamp, word };
        } else {
            // Handle the case where there aren't enough lines
            console.error("Invalid caption block:", block);
            return { timestamp: "", word: "" };
        }
    });
}

/*function updateCaptionDisplay(captionsData) {
    const captionContainer = document.getElementById('caption-container');
    captionContainer.innerHTML = ""; // Clear previous content

    const videoElement = document.getElementById("video");

    // Create spans for each caption line
    captionsData.forEach(caption => {
        const lines = caption.word.split('\n');
        lines.forEach(line => {
            const lineContainer = document.createElement("div");
            lineContainer.classList.add("caption-line");

            const span = document.createElement("span");
            span.textContent = line + " ";
            span.classList.add("caption-word");
            span.dataset.startTime = parseFloat(caption.timestamp);
            span.dataset.endTime = parseFloat(caption.timestamp) + 3; // Adjust the time window as needed
            span.addEventListener("click", () => {
                onCaptionWordClick(caption.timestamp, line);
            });

            lineContainer.appendChild(span);
            captionContainer.appendChild(lineContainer);
        });
    });

    // Update captions based on the video timestamp
    videoElement.addEventListener("timeupdate", function () {
        const currentTime = videoElement.currentTime;

        // Show/hide captions based on the video timestamp
        captionContainer.querySelectorAll('.caption-word').forEach(span => {
            const startTime = parseFloat(span.dataset.startTime);
            const endTime = parseFloat(span.dataset.endTime);

            if (currentTime >= startTime && currentTime <= endTime) {
                span.style.display = "inline";
            } else {
                span.style.display = "none";
            }
        });
    });
}

function onCaptionWordClick(timestamp, text) {
    console.log(`Clicked on word: ${text}, Timestamp: ${timestamp}`);
    // Add your logic here for handling the click event
    // For example, seek the video to the clicked caption timestamp
    const videoElement = document.getElementById("video");
    videoElement.currentTime = parseFloat(timestamp);
}
*/

/*function updateCaptionDisplay(captionsData) {
    const captionContainer = document.getElementById('caption-container');
    captionContainer.innerHTML = ""; // Clear previous content

    const videoElement = document.getElementById("video");

    // Create spans for each caption line
    captionsData.forEach(caption => {
        const lines = caption.word.split('\n');
        lines.forEach(line => {
            const lineContainer = document.createElement("div");
            lineContainer.classList.add("caption-line");

            const span = document.createElement("span");
            span.textContent = line + " ";
            span.classList.add("caption-word");
            span.dataset.startTime = parseFloat(caption.timestamp);
            span.dataset.endTime = parseFloat(caption.timestamp) + 10; // Adjust the time window as needed
            span.addEventListener("click", () => {
                onCaptionWordClick(caption.timestamp, line);
            });

            lineContainer.appendChild(span);
            captionContainer.appendChild(lineContainer);
        });
    });

    // Update captions based on the video timestamp
    videoElement.addEventListener("timeupdate", function () {
        const currentTime = videoElement.currentTime;

        // Show/hide captions based on the video timestamp
        let lineVisible = false;
        captionContainer.querySelectorAll('.caption-word').forEach(span => {
            const startTime = parseFloat(span.dataset.startTime);
            const endTime = parseFloat(span.dataset.endTime);

            if (currentTime >= startTime && currentTime <= endTime) {
                span.style.display = "inline";
                lineVisible = true;
            } else {
                span.style.display = "none";
            }
        });

        // Hide all lines if no line is visible
        if (!lineVisible) {
            captionContainer.querySelectorAll('.caption-line').forEach(lineContainer => {
                lineContainer.style.display = "none";
            });
        }
    });
}*/

function updateCaptionDisplay(captionsData) {
    const captionContainer = document.getElementById('caption-container');
    const videoElement = document.getElementById("video");

    // Update captions based on the video timestamp
    videoElement.addEventListener("timeupdate", function () {
        const currentTime = videoElement.currentTime;

        // Find the caption that is currently active
        const activeCaption = captionsData.find(caption => {
            const startTime = parseFloat(caption.timestamp);
            const endTime = startTime + 10; // Adjust the time window as needed

            return currentTime >= startTime && currentTime <= endTime;
        });

        // Display the active caption line by line
        if (activeCaption) {
            const lines = activeCaption.word.split('\n');
            captionContainer.innerHTML = ""; // Clear previous content

            lines.forEach((line, index) => {
                const lineContainer = document.createElement("div");
                lineContainer.classList.add("caption-line");

                const span = document.createElement("span");
                span.textContent = line + " ";
                span.classList.add("caption-word");

                lineContainer.appendChild(span);
                captionContainer.appendChild(lineContainer);

                // Set a timeout to clear each line after a certain duration
                setTimeout(() => {
                    lineContainer.style.display = "none";
                }, (index + 1) * 1000); // Adjust the duration (in milliseconds) as needed
            });
        }
    });
}
