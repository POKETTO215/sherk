let rawText = `
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
`.trim();

let textLines = rawText.split('\n'); // 原始分段
let charData = [];
let fontSize;
let lineSpacing;
let letterSpacing;
let isReadingMode = false;
let currentCharIndex = 0;
let distortionAmount = 1.0;
let targetDistortion = 1.0;
let restoreTimer = null;
let wrappedLines = []; // 自动分行结果

function preload() {
  // 推荐系统自带字体，兼容好
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

// 自动分行函数，返回每一行
function wrapLines(textLines, fontSize, letterSpacing, maxLineWidth) {
  let result = [];
  for (let l = 0; l < textLines.length; l++) {
    let line = textLines[l];
    let currentLine = "";
    for (let i = 0; i < line.length; i++) {
      let testLine = currentLine + line[i];
      let lineWidth = (testLine.length - 1) * letterSpacing;
      if (lineWidth > maxLineWidth && currentLine.length > 0) {
        result.push(currentLine);
        currentLine = line[i];
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine.length > 0) result.push(currentLine);
  }
  return result;
}

function prepareLayout() {
  charData = [];

  fontSize = max(15, min(windowWidth, windowHeight) / 40);
  lineSpacing = fontSize * 1.2;
  letterSpacing = fontSize * 1.2;

  textSize(fontSize);
  textAlign(CENTER, CENTER);

  // 边页距（左右各10%）
  let marginX = width * 0.10;
  let maxLineWidth = width - marginX * 2;

  // 自动分行，结果是新的每一行（再排版）
  wrappedLines = wrapLines(textLines, fontSize, letterSpacing, maxLineWidth);

  let startY = (height - (wrappedLines.length - 1) * lineSpacing) / 2;

  for (let line = 0; line < wrappedLines.length; line++) {
    let lineText = wrappedLines[line];
    let lineWidth = (lineText.length - 1) * letterSpacing;
    let centerX = marginX + (maxLineWidth - lineWidth) / 2;
    let y = startY + line * lineSpacing;
    for (let i = 0; i < lineText.length; i++) {
      let x = centerX + i * letterSpacing;
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

// === 移动端触摸兼容 ===
function touchStarted() {
  mousePressed();
  return false;
}

function touchEnded() {
  mouseReleased();
  return false;
}
