
console.log("oneko.js loaded");
const isReducedMotion =
  window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
  window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

function oneko() {
  console.log("oneko() function called");
  const nekoEl = document.createElement("div");
  let nekoPosX = 32;
  let nekoPosY = 32;
  let mousePosX = 0;
  let mousePosY = 0;
  const isReducedMotion =
    window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
    window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;
  let frameCount = 0;
  let idleTime = 0;
  let idleAnimation = null;
  let idleAnimationFrame = 0;
  const nekoSpeed = 10;
  const spriteSets = {
    idle: [[-3, -3]],
    alert: [[-7, -3]],
    scratch: [
      [-5, 0],
      [-6, 0],
      [-7, 0],
    ],
    tired: [[-3, -2]],
    sleeping: [
      [-2, 0],
      [-2, -1],
    ],
    N: [
      [-1, -2],
      [-1, -3],
    ],
    NE: [
      [0, -2],
      [0, -3],
    ],
    E: [
      [-3, 0],
      [-3, -1],
    ],
    SE: [
      [-5, -1],
      [-5, -2],
    ],
    S: [
      [-6, -3],
      [-7, -2],
    ],
    SW: [
      [-5, -3],
      [-6, -1],
    ],
    W: [
      [-4, -2],
      [-4, -3],
    ],
    NW: [
      [-2, -2],
      [-2, -3],
    ],
  };
  function create() {
    console.log("create() function called");
    nekoEl.id = "oneko";
    nekoEl.style.width = "32px";
    nekoEl.style.height = "32px";
    nekoEl.style.position = "fixed";
    nekoEl.style.backgroundImage = "url('assets/images/oneko.gif')";
    nekoEl.style.imageRendering = "pixelated";
    nekoEl.style.left = "32px";
    nekoEl.style.top = "32px";

    const img = new Image();
    img.src = 'assets/images/oneko.gif';
    img.onload = function() {
        console.log("Image loaded successfully");
        document.body.appendChild(nekoEl);
    };
    img.onerror = function() {
        console.error("Error loading image");
    };

    document.onmousemove = (event) => {
      mousePosX = event.clientX;
      mousePosY = event.clientY;
    };

    window.onekoInterval = setInterval(frame, 100);
  }

  function setSprite(name, frame) {
    const sprite = spriteSets[name][frame % spriteSets[name].length];
    nekoEl.style.backgroundPosition = `${sprite[0] * 32}px ${
      sprite[1] * 32
    }px`;
  }

  function resetIdleAnimation() {
    idleAnimation = null;
    idleAnimationFrame = 0;
  }

  function idle() {
    idleTime += 1;

    // every 10 frames, switch to a different idle animation
    if (
      idleTime > 10 &&
      Math.floor(Math.random() * 200) == 0 &&
      idleAnimation == null
    ) {
      idleAnimation = ["sleeping", "scratch"][
        Math.floor(Math.random() * 2)
      ];
    }

    switch (idleAnimation) {
      case "sleeping":
        if (idleAnimationFrame < 8) {
          setSprite("tired", 0);
          break;
        }
        setSprite("sleeping", Math.floor(idleAnimationFrame / 4));
        if (idleAnimationFrame > 192) {
          resetIdleAnimation();
        }
        break;
      case "scratch":
        setSprite("scratch", idleAnimationFrame);
        if (idleAnimationFrame > 9) {
          resetIdleAnimation();
        }
        break;
      default:
        setSprite("idle", 0);
        return;
    }
    idleAnimationFrame += 1;
  }

  function frame() {
    frameCount += 1;
    const diffX = nekoPosX - mousePosX;
    const diffY = nekoPosY - mousePosY;
    const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

    if (distance < nekoSpeed || distance < 48) {
      idle();
      return;
    }

    idleTime = 0;
    resetIdleAnimation();

    let direction;
    const angle = Math.atan2(diffY, diffX);
    const degrees = (angle * 180) / Math.PI;

    if (degrees > -22.5 && degrees <= 22.5) {
      direction = "W";
    } else if (degrees > 22.5 && degrees <= 67.5) {
      direction = "NW";
    } else if (degrees > 67.5 && degrees <= 112.5) {
      direction = "N";
    } else if (degrees > 112.5 && degrees <= 157.5) {
      direction = "NE";
    } else if (degrees > 157.5 || degrees <= -157.5) {
      direction = "E";
    } else if (degrees > -157.5 && degrees <= -112.5) {
      direction = "SE";
    } else if (degrees > -112.5 && degrees <= -67.5) {
      direction = "S";
    } else if (degrees > -67.5 && degrees <= -22.5) {
      direction = "SW";
    }

    setSprite(direction, frameCount);

    nekoPosX -= (diffX / distance) * nekoSpeed;
    nekoPosY -= (diffY / distance) * nekoSpeed;

    nekoEl.style.left = `${nekoPosX - 16}px`;
    nekoEl.style.top = `${nekoPosY - 16}px`;
  }

  create();
}

if (!isReducedMotion) {
  oneko();
}
