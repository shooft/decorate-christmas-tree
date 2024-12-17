/*
Wep API's:

✅ Web Audio API
✅ HTML Drag & Drop API
✅ Speech API
✅ View Transition API
❌ Web Storage API / Local Storage  (save decorated Christmas Tree)

*/

webAudioAPI()
dragAndDropAPI()
speechAPI()

// Web Audio API
// Source: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API
// Assignement: Add a volume button (<input type="range">) to handle the volume of the background music
function webAudioAPI() {
  if (!window.AudioContext) return

  const audioElement = document.querySelector('audio')
  const audioContext = new AudioContext()
  const track = audioContext.createMediaElementSource(audioElement)
  const playButton = document.querySelector('button')

  track.connect(audioContext.destination)

  playButton.addEventListener('click', togglePlayBack, false)

  function togglePlayBack (e) {
    // Check if context is in suspended state (autoplay policy)
    if (audioContext.state === "suspended") {
      audioContext.resume()
    }

    // Play or pause track depending on state
    if (playButton.dataset.playing === "false") {
      audioElement.play()
      playButton.textContent = "Pause 🎶"
      playButton.dataset.playing = "true"
    } else if (playButton.dataset.playing === "true") {
      audioElement.pause()
      playButton.textContent = "Play 🎶"
      playButton.dataset.playing = "false"
    }
  }
}

// Drag & Drop API
// source: https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
// Assignement: save decorated Christmas Tree in Local Storage
function dragAndDropAPI(){
  if (!('draggable' in document.createElement('div'))) return

  const decorations = document.querySelectorAll('.decorations li')
  const dropArea = document.querySelector('.tree')

  decorations.forEach((decoration, index) => {
    decoration.setAttribute('draggable', 'true')
  
    // Drag start event
    decoration.addEventListener('dragstart', (event) => {
      event.dataTransfer.setData('text/plain', event.target.id)
      event.stopPropagation()
    })
  })

  dropArea.addEventListener('dragover', (event) => {
    event.stopPropagation()
    event.preventDefault()
  })

  dropArea.addEventListener('drop', (event) => {
    const decorationId = event.dataTransfer.getData('text/plain')
    const decoration = document.getElementById(decorationId)
    
    // todo: feature detection for View Transition API
    const viewTransition = document.startViewTransition(() => {
      if (decoration) {
        decoration.dataset.sound ? audioFile = `${decorationId}.wav` : audioFile = 'slide.wav'
        const audioElement = new Audio(`audio/${audioFile}`)
        audioElement.play()
        // sounds from: https://mixkit.co/free-sound-effects/
        // license: https://mixkit.co/license/

        dropArea.appendChild(decoration)
        
        const dropAreaRect = dropArea.getBoundingClientRect()

        decoration.style.position = 'absolute'
          
        const offsetX = Math.round(event.clientX) - Math.round(dropAreaRect.left) - 15
        const offsetY = Math.round(event.clientY) - Math.round(dropAreaRect.top) - 10 

        decoration.style.setProperty('--offset-x', `${offsetX}px`)
        decoration.style.setProperty('--offset-y', `${offsetY}px`)     
      }
    })

    event.preventDefault()
  })
}

// Speech API
// source: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
// Assignement: add more commando's triggering fun stuff on the page
function speechAPI(){
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;

  if (!SpeechRecognition && !SpeechGrammarList) return
  
  const recognition = new SpeechRecognition()
  const speechRecognitionList = new SpeechGrammarList()
  const commands = ['kerst']
  const grammar = `#JSGF V1.0; grammar colors; public <christmas> = ${commands.join(" | ",)};`

  speechRecognitionList.addFromString(grammar, 1)

  recognition.grammars = speechRecognitionList
  recognition.continuous = false
  recognition.lang = "nl-NL"
  recognition.interimResults = false
  recognition.maxAlternatives = 1

  recognition.start()

  recognition.addEventListener('result', (event) => {
    const command = event.results[0][0].transcript

    console.log(command)

    if (command  === 'kerst') {
      document.body.classList.add('christmas')
      const audioElement = new Audio('audio/magic-christmas-night-264068.mp3')
      audioElement.play()
      
      setTimeout(() => {
        audioElement.pause()
        document.body.classList.add('audio-control')
      }, 10000)
      
    } 
  })
}
