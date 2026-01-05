// Sound effects using Web Audio API
class SoundManager {
  private audioContext: AudioContext | null = null;
  private isMuted = false;

  private initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) {
    if (this.isMuted) return;
    
    this.initAudioContext();
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = type;
    oscillator.frequency.value = frequency;

    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  private playNoise(duration: number, volume: number = 0.2) {
    if (this.isMuted) return;

    this.initAudioContext();
    if (!this.audioContext) return;

    const bufferSize = this.audioContext.sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();

    source.buffer = buffer;
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    source.start(this.audioContext.currentTime);
  }

  // 카드 뒤집기 소리
  cardFlip() {
    this.playTone(400, 0.1, 'sine', 0.2);
    setTimeout(() => this.playTone(600, 0.1, 'sine', 0.2), 50);
  }

  // 칩 배팅 소리
  chipPlace() {
    this.playTone(800, 0.15, 'sine', 0.25);
    this.playNoise(0.1, 0.15);
  }

  // 칩 제거 소리
  chipRemove() {
    this.playTone(600, 0.1, 'sine', 0.2);
  }

  // 승리 소리 (승자 발표)
  victory() {
    const notes = [523, 659, 784]; // C5, E5, G5
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.3, 'sine', 0.3), i * 150);
    });
  }

  // 패배 소리
  defeat() {
    this.playTone(400, 0.2, 'sine', 0.2);
    setTimeout(() => this.playTone(300, 0.2, 'sine', 0.2), 150);
  }

  // 타이 소리
  tie() {
    this.playTone(523, 0.15, 'sine', 0.25);
    setTimeout(() => this.playTone(523, 0.15, 'sine', 0.25), 100);
    setTimeout(() => this.playTone(523, 0.15, 'sine', 0.25), 200);
  }

  // 딜 시작 소리
  dealStart() {
    this.playTone(700, 0.08, 'sine', 0.2);
    setTimeout(() => this.playTone(800, 0.08, 'sine', 0.2), 50);
  }

  // 버튼 클릭 소리
  buttonClick() {
    this.playTone(1000, 0.05, 'sine', 0.15);
  }

  // 카드 쪼기 시작
  squeezeStart() {
    this.playTone(600, 0.1, 'sine', 0.2);
  }

  // 카드 쪼기 중 (연속 음)
  squeezeProgress() {
    this.playTone(700, 0.05, 'sine', 0.15);
  }

  // 카드 쪼기 완료
  squeezeComplete() {
    this.playTone(800, 0.15, 'sine', 0.25);
    setTimeout(() => this.playTone(900, 0.1, 'sine', 0.2), 100);
  }

  toggle() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  isSoundMuted() {
    return this.isMuted;
  }
}

export const soundManager = new SoundManager();
