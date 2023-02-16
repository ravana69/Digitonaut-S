let canvas = document.getElementById('ca')
function setup () {
  canvas = createCanvas(windowWidth, windowHeight);
  colorMode(HSL);
}
function windowResized () {
  resizeCanvas(windowWidth, windowHeight); 
}
function draw () {
  translate(width/2, height/2);
  rotate(millis() * 0.001);

  stroke(60, 190, 230);
  let branches = 10;
  for (let a = 0; a < branches; a++) {
    drawingContext.save();
    rotate(((a) / branches) * TWO_PI);
    let r = 100;
    let orbits = 4;
    for (let i =1; i < orbits; i++) {
      translate(r, 4);
      r *= .99;
      let speed = (i / (orbits / 2));
      let h = (i* 21) / Math.ceil(180);
      rotate(millis() * 0.01 * speed);
      stroke((h * 1360) % 1360, 70, 50, 0.1);
      line(0, 0, r, 0);
    }
    drawingContext.restore();
  }
}


console.clear();

const twodWebGL = new WTCGL(
  document.querySelector('canvas#webgl'), 
  document.querySelector('script#vertexShader').textContent, 
  document.querySelector('script#fragmentShader').textContent,
  window.innerWidth,
  window.innerHeight,
  1
);
twodWebGL.startTime = -1100;

window.addEventListener('resize', () => {
  twodWebGL.resize(window.innerWidth, window.innerHeight);
});


// track mouse move
let mousepos = [0,0];
const u_mousepos = twodWebGL.addUniform('mouse', WTCGL.TYPE_V2, mousepos);
window.addEventListener('pointerdown', (e) => { e.preventDefault(); });
window.addEventListener('pointermove', (e) => {
  e.preventDefault();
  let ratio = window.innerHeight / window.innerWidth;
  if(window.innerHeight > window.innerWidth) {
    mousepos[0] = (e.pageX - window.innerWidth / 2) / window.innerWidth;
    mousepos[1] = (e.pageY - window.innerHeight / 2) / window.innerHeight * -1 * ratio;
  } else {
    mousepos[0] = (e.pageX - window.innerWidth / 2) / window.innerWidth / ratio;
    mousepos[1] = (e.pageY - window.innerHeight / 2) / window.innerHeight * -1;
  }
  twodWebGL.addUniform('mouse', WTCGL.TYPE_V2, mousepos);
});

// Load all our textures. We only initiate the instance once all images are loaded.
const textures = [
  {
    name: 'noise',
    url: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/982762/noise.png',
    type: WTCGL.IMAGETYPE_TILE,
    img: null
  }
];
const loadImage = function (imageObject) {
  let img = document.createElement('img');
  img.crossOrigin="anonymous";
  
  return new Promise((resolve, reject) => {
    img.addEventListener('load', (e) => {
      imageObject.img = img;
      resolve(imageObject);
    });
    img.addEventListener('error', (e) => {
      reject(e);
    });
    img.src = imageObject.url
  });
}
const loadTextures = function(textures) {
  return new Promise((resolve, reject) => {
    const loadTexture = (pointer) => {
      if(pointer >= textures.length || pointer > 10) {
        resolve(textures);
        return;
      };
      const imageObject = textures[pointer];

      const p = loadImage(imageObject);
      p.then(
        (result) => {
          twodWebGL.addTexture(result.name, result.type, result.img);
        },
        (error) => {
          console.log('error', error)
        }).finally((e) => {
          loadTexture(pointer+1);
      });
    }
    loadTexture(0);
  });
  
}

loadTextures(textures).then(
  (result) => {
    twodWebGL.initTextures();
    // twodWebGL.render();
    twodWebGL.running = true;
  },
  (error) => {
    console.log('error');
  }
);


///////////