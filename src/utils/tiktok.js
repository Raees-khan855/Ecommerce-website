export const tiktokTrack = (event, data = {}) => {
  if (typeof window === "undefined") return;

  if (window.ttq && typeof window.ttq.track === "function") {
    window.ttq.track(event, data);

    console.log("TikTok Event Sent:", event, data);
  } else {
    console.warn("TikTok Pixel is not ready:", event, data);
  }
};
