/**
 * Audio Visualiser using HTML 5 audio and canvas.
 * 
 * v0.0.1
 * 
 * Based on https://github.com/wayou/HTML5_Audio_Visualizer
 */
class Visualiser {

    constructor(target, options = {}) {
        this.visualiser = target ? document.getElementById(target) : null,
        this.audioSrc,
        this.audioCtx,
        this.canvasCtx,
        this.analyser,
        this.frameHandle = null,
        this.audio  = this.visualiser.getElementsByTagName('audio')[0],
        this.canvas = this.visualiser.getElementsByTagName('canvas')[0],
        this.cHeight,
        this.cWidth,
        this.meterWidth = options.meterWidth || 5,
        this.meterGap = options.meterGap || 2,
        this.boostVal = options.boostVal || 1.5,
        this.meterNum = options.meterNum || 400,

        this.initDone = false;

        // Audio controls
        this.controls = this.visualiser.querySelectorAll('.audio-controls')[0];
        this.playPauseButton = options.playPause ? document.getElementById(options.playPause) : this.visualiser.querySelector('.playpause'),
        this.timerCurrentText = options.timerCurrent ? document.getElementById(options.timerCurrent) : this.controls.querySelectorAll('.time-current')[0],
        this.timerTotalText = options.timerTotal ? document.getElementById(options.timerTotal) : this.controls.querySelectorAll('.time-total')[0];
        this.scrub = null;

        this.init();
    }

    /**
     * init - set up any required initialisation functions. This should only be 
     * run once from the constructor.
     */
    init() {
      const self = this;
      this.audio.addEventListener('loadedmetadata', () => {
        this.initControls();
        this.initCanvas();
      });

      this.createAudio();
    }

    createAudio() {
      let source = this.audio.dataset.src;
      this.audio.setAttribute('src', source);
    }
    /**
     * initAudio - initialise the audio context and event listener to kick off 
     * the animation
     */
    initAudio() {
        const self = this;

        this.audioCtx = new AudioContext();
        this.analyser = this.audioCtx.createAnalyser();
        this.audioSrc = this.audioCtx.createMediaElementSource(this.audio);
        this.analyser.connect(this.audioCtx.destination);
        this.audioSrc.connect(this.analyser);

    }

    /**
     * initCanvas - initialize the canvas and its variables ready for the
     * animation
     */
    initCanvas() {
        this.canvasCtx = this.canvas.getContext('2d');
        this.cWidth = this.canvas.width;
        this.cHeight = this.canvas.height;
        this.meterNum = this.meterNum / (this.meterWidth); //count of the meters
    }

    /**
     * doFrame - run a frame of the audio visualiser and start the RAF process
     */
    doFrame() {

        const self = this;
        
        let array = new Uint8Array(self.analyser.frequencyBinCount);
        
        this.analyser.getByteFrequencyData(array);
        
        let step = Math.round(array.length / this.meterNum); //sample limited data from the total array
        
        this.canvasCtx.clearRect(0, 0, this.cWidth, this.cHeight);

        for (var i = 0; i < this.meterNum; i++) {

            var value = array[i * step];
            self.canvasCtx.fillStyle = this.barColor; //set the filllStyle to gradient for a better look
            self.canvasCtx.fillRect(i * (this.meterWidth + this.meterGap), this.cHeight, this.meterWidth, this.cHeight - (value * 1.5) ); //the meter
        }

        requestAnimationFrame(() => this.doFrame());
    }

    /**
     * initControls - initialize the audio controls
     */
    initControls() {
        const self = this;
        
        this.audio.addEventListener('play', () => {
          if (!this.initDone) {
            self.initAudio(); 
            self.doFrame();
            this.initDone = true;
          }
        });

        self.setTotalTime()
        this.playPauseButton.addEventListener('click', (e) => self.playPause())
        this.audio.addEventListener('timeupdate', (e) => self.updateScrub())
        this.audio.addEventListener('play', () => this.playPauseButton.classList.add('pause'));
        this.audio.addEventListener('pause', () => this.playPauseButton.classList.remove('pause'));
        this.barColor = getComputedStyle(this.controls).borderLeftColor;
    }

    /**
     * playPause - play and pause the audio and update the button
     * @returns boolean true on success
     */
    playPause() {
        if (this.audio.paused) {
            //this.playPauseButton.classList.add('pause');
            this.audio.play();
        } else {
            //this.playPauseButton.classList.remove('pause');
            this.audio.pause();
        }

        return true;
    }

    setTotalTime() {
        let minutes = Math.floor(this.audio.duration / 60);
        let seconds = Math.floor(this.audio.duration - minutes * 60);
        let minuteValue;
        let secondValue;
        
        if (minutes < 10) {
          minuteValue = '0' + minutes;
        } else {
          minuteValue = minutes;
        }
      
        if (seconds < 10) {
          secondValue = '0' + seconds;
        } else {
          secondValue = seconds;
        }
      
        let mediaTime = minuteValue + ':' + secondValue;
        this.timerTotalText.textContent = mediaTime;

        this.scrub = document.createElement('input');
        this.scrub.setAttribute('type', 'range');
        this.scrub.setAttribute('min', '0');
        this.scrub.setAttribute('max', Math.floor(this.audio.duration));
        this.scrub.setAttribute('value', Math.floor(this.audio.currentTime));
        this.scrub.addEventListener('change', () => {
          this.updateTimer();
        });

        this.scrub.addEventListener('mousedown', () => {

          this.audio.pause();
        })

        this.scrub.addEventListener('touchstart', () => {

          this.audio.pause();
        })

        this.scrub.addEventListener('mouseup', () => {
          this.audio.currentTime = this.scrub.value;
          this.audio.play();
        })

        this.scrub.addEventListener('touchend', () => {
          this.audio.currentTime = this.scrub.value;
          this.audio.play();
        })

        this.scrub.addEventListener('keydown', (e) => {
          if (e.key == 'ArrowRight') {
            this.audio.pause();
            this.scrub.value = parseInt(this.scrub.value) + 10;
          }

          if (e.key == 'ArrowLeft') {
            this.audio.pause();
            this.scrub.value = parseInt(this.scrub.value) - 10;
          }
        })

        this.scrub.addEventListener('keyup', (e) => {
          if (e.key == 'ArrowRight' || e.key == 'ArrowLeft') {
            this.audio.currentTime = this.scrub.value;
            this.audio.play();
          }

          if (e.key == " ") {
            this.playPause();
          }
        })
        let scrubContainer = this.controls.getElementsByClassName('scrub')[0];
        scrubContainer.appendChild(this.scrub);

    }
    updateScrub() {
      this.scrub.value = this.audio.currentTime;
      let evt = new Event('change')
      this.scrub.dispatchEvent(evt);
    }

    updateTimer() {
        let minutes = Math.floor(this.scrub.value / 60);
        let seconds = Math.floor(this.scrub.value - minutes * 60);
        let minuteValue;
        let secondValue;
      
        if (minutes < 10) {
          minuteValue = '0' + minutes;
        } else {
          minuteValue = minutes;
        }
      
        if (seconds < 10) {
          secondValue = '0' + seconds;
        } else {
          secondValue = seconds;
        }
      
        let mediaTime = minuteValue + ':' + secondValue;
        this.timerCurrentText.textContent = mediaTime;
    }
}

/**
 * kick off the script.
 */

let targets = document.querySelectorAll('.audio-embed');
targets.forEach((target,index) => {

  let targetVisualiser = target.querySelector('.visualiser-container');
  targetVisualiser.setAttribute('id', 'audio-' + index);
  vis = new Visualiser('audio-' + index);
})