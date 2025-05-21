let textLines = `
And blood-black nothingness began to spin.
A system of cells interlinked within cells interlinked within one stem.
And dreadfully distinct against the dark, a tallwhite fountain played.
Have you ever been in an institution ?  Cells.
Do they keep you in a cell ?  Cells.
When you're not performing your duties do they keep you in a little box ?  Cells.
Interlinked.
What's it like to hold the hand of someone you love? Interlinked.
Did they teach you how to feel, finger to finger ? Interlinked.
Do you long for having your heart interlinked ?  Interlinked.
Do you dream about being interlinked ?
Do you feel that there's a part of you that's missing ?  Interlinked.
Do you like being separated from other people ?  Interlinked.
Within cells interlinked.
Within cells interlinked.
Why don’t you say that three times: Within cells interlinked.
Within cells interlinked. Within cells interlinked. Within cells interlinked.
`.trim().split('\n');

let charData = [];
let fontSize;
let lineSpacing;
let letterSpacing;
let isReadingMode = false;
let currentCharIndex = 0;
let distortionAmount = 1.0;
let targetDistortion = 1.0;
let restoreTimer = null;

function preload() {
  // 可选：加载自定义字体
  // customFont = loadFont('SmileySans-Optimized.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('PingFang SC, Microsoft YaHei, SimHei, Arial, sans-serif');
  prepareLayout();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  prepareLayout();
}

function prepareLayout() {
  charData = [];

  fontSize = Math.max(15, Math.min(windowWidth, windowHeight) / 40);
  lineSpacing = fontSize * 2.0;
  letterSpacing = fontSize * 1.2;

  textSize(fontSize);
  textAlign(CENTER, CENTER);

  // 边页距（左右各10%）
  let marginX = width * 0.10;
  let maxLineWidth = width - marginX * 2;

  let startY = (height - (textLines.length - 1) * lineSpacing) / 2;

  for (let line = 0; line < textLines.length; line++) {
    let lineText = textLines[line];

    // 动态调整该行字距，使行宽不超过最大宽度
    let thisLetterSpacing = letterSpacing;
    if (lineText.length > 1) {
      let idealSpacing = maxLineWidth / (lineText.length - 1);
      // 限制最小/最大字距，防止太密集或太稀疏
      thisLetterSpacing = constrain(idealSpacing, fontSize * 0.25, fontSize * 0.7);
    }
    let lineWidth = (lineText.length - 1) * thisLetterSpacing;

    // 居中起点（加上marginX后再加剩余空白的一半）
    let centerX = marginX + (maxLineWidth - lineWidth) / 2;

    let y = startY + line * lineSpacing;
    for (let i = 0; i < lineText.length; i++) {
      let x = centerX + i * thisLetterSpacing;
      let char = lineText[i];
      charData.push({ x, y, baseX: x, baseY: y, char, angle: 0 });
    }
  }
  currentCharIndex = 0;
}

function draw() {
  background(0);
  fill(255);
  distortionAmount = lerp(distortionAmount, targetDistortion, 0.05);

  for (let i = 0; i < charData.length && i < currentCharIndex; i++) {
    let c = charData[i];
    push();
    translate(c.x, c.y);
    rotate(radians(c.angle));
    text(c.char, 0, 0);
    pop();

    // 扰动大小适中，所有字符幅度一致
    let factor = distortionAmount;
    c.x = c.baseX + random(-2, 2) * factor;
    c.y = c.baseY + random(-3, 3) * factor;
    c.angle = random(-5, 5) * factor;
  }

  if (currentCharIndex < charData.length) {
    currentCharIndex += 1;
  }
}

function mousePressed() {
  isReadingMode = true;
  targetDistortion = 0;
  if (restoreTimer) {
    clearTimeout(restoreTimer);
    restoreTimer = null;
  }
}

function mouseReleased() {
  isReadingMode = false;
  restoreTimer = setTimeout(() => {
    targetDistortion = 1;
    restoreTimer = null;
  }, 2000);
}

// ... 你之前的代码 ...

function mousePressed() {
  isReadingMode = true;
  targetDistortion = 0;
  if (restoreTimer) {
    clearTimeout(restoreTimer);
    restoreTimer = null;
  }
}

function mouseReleased() {
  isReadingMode = false;
  restoreTimer = setTimeout(() => {
    targetDistortion = 1;
    restoreTimer = null;
  }, 2000);
}

// === 移动端触摸兼容 ===
function touchStarted() {
  mousePressed();
  return false; // 防止浏览器页面滑动
}

function touchEnded() {
  mouseReleased();
  return false;
}
