let cashAudio: HTMLAudioElement | null = null;

export function playCashSound() {
  try {
    if (!cashAudio) {
      cashAudio = new Audio("/sounds/cash.wav"); // ✅ WAV
      cashAudio.volume = 0.8;
    }

    cashAudio.currentTime = 0;
    cashAudio.play().catch(() => {});
  } catch {}
}
