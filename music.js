import { k } from "/kaboom.js";

class Music {
  currentTrack = null

  play(trackName, audioConfig) {
    this.currentTrack = k.play(trackName, {
      loop: true,
      ...(audioConfig ?? {}),
    });
  }

  stop() {
    this.currentTrack.stop();
  }

  crossFade(trackName, audioConfig) {
    audioConfig = audioConfig ?? {};
    const prevTrack = this.currentTrack;
    const curTrackVolume = audioConfig.volume ?? 1;
    const prevTrackVolume = prevTrack.volume();
    if (audioConfig.volume) delete audioConfig.volume;

    this.play(trackName, {
      loop: true,
      volume: 0,
      ...audioConfig,
    });
    
    const fadeTime = 3;
    let spent = 0;
    const cancelCrossFade = k.action(() => {
      spent += k.dt();
      const percent = Math.min(1, (spent / fadeTime));
      if (percent === 0) return;
      this.currentTrack.volume(curTrackVolume * percent);
      prevTrack.volume(prevTrackVolume - (prevTrackVolume * percent));
      if (percent === 1) {
        cancelCrossFade();
        prevTrack.stop();
      }
    });
  }
}

export default new Music();