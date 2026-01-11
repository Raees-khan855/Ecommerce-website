export const tiktokTrack = (event, data = {}) => {
  if (window.ttq) {
    window.ttq.track(event, data);
  }
};
