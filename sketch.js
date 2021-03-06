var timeStore;

function preload() {
  mySong = loadSound('assets/SteinsGateOP.mp3')
  logoInverted = loadImage('assets/logo-alpha.png')
  underline = loadImage('assets/underline.png')
  logoWhite = loadImage('assets/logo-white.png')
  logoGlare = loadImage('assets/logo-glare.png')
  logoBorder = loadImage('assets/logo-border.png')
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  //pixelDensity(1);
  analyzer = new p5.Amplitude();
  analyzer.setInput(mySong);
  fft = new p5.FFT();
  mySong.play();
  imageMode(CENTER);
  strokeWeight(2);
  timeStore = millis();
}
drawOverlay = 1;
var imgScale = 10;
var logoAlpha = 0;
var finalAlpha = 0;
var outlineAlpha = 0;
var seconds;

function draw() {
  //translate(width/2,height/2);
  background(0);
  volume = analyzer.getLevel();
  var waveform = fft.waveform();
  noFill();
  seconds = (millis() - timeStore) / 1000;
  if (seconds < 28) {
    if (seconds < 20) {
      //radial visualization at the start.
      push();
      translate(width / 2, height / 2);
      colorMode(HSB);
      strokeWeight(1);
      var alpha, deltaX, deltaY;
      var spectrum = fft.analyze();
      var length = map(spectrum.length, 0, 255, 0, 360);
      for (alpha = 0; alpha < length; alpha += 6) {
        var x = map(alpha, 0, spectrum.length, 0, 360);
        var h = map(spectrum[alpha], 0, 255, 0, 360);
        deltaX = cos(x + frameCount * 0.1) * h * 3;
        deltaY = sin(x + frameCount * 0.1) * h * 3;
        stroke(lerpColor(color(255, 200, 70), color(0, 200, 70), volume * 6 * h / 360));
        line(0, 0, deltaX, deltaY);
      }
      pop();

    }
    push();
    if (imgScale > 1.1) {
      imgScale += -0.1
    } else {
      imgScale = 1;
    }
    if (seconds < 10) {
      translate(width / 2, height / 2);
      scale(imgScale);
      translate(-width / 2, -height / 2);
    }
    //fake mask effect (rectangle + alpha mapped image overlay)
    var imageSize = createVector(703, 176);
    if (drawOverlay) {
      image(logoInverted, width / 2, height / 2, imageSize.x, imageSize.y);
      fill(0);
      noStroke();
      rect(0, 0, width, height / 2 - imageSize.y / 2);
      rect(0, height / 2 + imageSize.y / 2, width, height / 2 - imageSize.y / 2);
      rect(0, 0, width / 2 - imageSize.x / 2, height);
      rect(width / 2 + imageSize.x / 2, 0, width / 2 - imageSize.x / 2, height);
    }
    push();
    //audio responsive underline
    imageMode(CORNER)
    if (volume * 8 < 1) {
      var imgVolume = 1 / (volume * 8);
    } else {
      var imgVolume = 1;
    }
    if (seconds < 14) {
      tint(255, volume * 1000);
    }
    image(underline, width / 2 - imageSize.x / 2, height / 2 - imageSize.y / 2, imageSize.x / imgVolume, imageSize.y, 0, 0, imageSize.x * 2 / imgVolume, imageSize.y * 2);
    pop();
    //white on black logo + audio responsive glare
    if (seconds > 14) {
      push();

      if (logoAlpha < 1.1) {
        logoAlpha += 0.1;
      }
      tint(255, logoAlpha * 255);
      image(logoWhite, width / 2, height / 2, 2268 / 2, 567 / 2);
      pop();
      push();
      tint(255, logoAlpha * volume * 3000);
      image(logoGlare, width / 2, height / 2, 2268 / 2, 567 / 2);
      pop();
    }
    pop();
  }
  //final black on white logo + waveform audio visualization
  if (seconds > 25) {
    if (finalAlpha < 256) {
      finalAlpha += 10;
    }
    noStroke();
    fill(255, finalAlpha);
    rect(0, 0, width, height);
    stroke(255);
    noFill();
    strokeWeight(2);
    if (seconds > 26) {
      for (var j = 0; j < 5; j++) {
        stroke(255 - (j * 255 / 5 + volume * 1000))
        beginShape();
        for (var i = 0; i < waveform.length; i += 2) {
          var x = map(i, 0, waveform.length, 0, width);
          var y = map(waveform[i], -1, 1, height * 0.75, height / 4);
          vertex(x + random(-2, 2), y + j * 200 * volume + random(-3, 3) - j * 100 * volume);
        }
        endShape();
      }
    }
    if (outlineAlpha < 256) {
      outlineAlpha += 10;
    } else {
      outlineAlpha = 255;
    }

    tint(255, outlineAlpha);
    image(logoBorder, width / 2, height / 2, 2268 / 2, 567 / 2);
  }



}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
