export const requestFullscreen = (el) => {
  return new Promise((resolve) => {
    const onResize = function () {
      global.setTimeout(() => {
        if (!fullscreenElement()) {
          window.removeEventListener('resize', onResize);
          resolve();
        }
      }, 100);
    };
    window.addEventListener('resize', onResize);
    el = el || document.body;
    if ('requestFullScreen' in el) {
      el.requestFullScreen();
    } else if ('mozRequestFullScreen' in el) {
      el.mozRequestFullScreen();
    } else if ('webkitRequestFullScreen' in el) {
      el.webkitRequestFullScreen();
    }
  });
};

export const fullscreenElement = () => {
  return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement;
};

export const closeFullscreen = () => {
  if ('exitFullScreen' in document) {
    document.exitFullScreen();
  } else if ('mozCancelFullScreen' in document) {
    document.mozCancelFullScreen();
  } else if ('webkitCancelFullScreen' in document) {
    document.webkitCancelFullScreen();
  }
};

export const toggleFullscreen = (el, flag) => {
  el = el || document.body;
  if (flag || (flag === undefined && !isFullscreen(el))) {
    requestFullscreen(el);
    return true;
  } else {
    closeFullscreen();
    return false;
  }
};

export const isFullscreen = () => {
  return !!document.fullscreenElement;
};
