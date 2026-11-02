/**
 * Pure procedural Web Audio synthesizer for Temple Ghanta (Bell Chime)
 * and Devotional notifications. Zero external audio file dependencies.
 */
class TempleAudio {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (this.isMuted) return null;
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Resonates like a traditional temple brass bell (Ghanta)
   * with fundamental 528Hz (sacred Solfeggio / Om chime) and shimmering harmonics.
   */
  public playTempleBell() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Harmonic series of a resonant bronze bell
    const frequencies = [528, 1056, 1584, 2112, 2900];
    const gains = [0.4, 0.25, 0.15, 0.08, 0.04];
    const decays = [3.2, 2.5, 1.8, 1.2, 0.8];

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      // Slight natural vibrato
      osc.frequency.exponentialRampToValueAtTime(freq * 0.998, now + decays[idx]);

      gainNode.gain.setValueAtTime(0, now);
      // Sharp strike
      gainNode.gain.linearRampToValueAtTime(gains[idx], now + 0.005);
      // Long rich resonance tail
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + decays[idx]);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + decays[idx] + 0.1);
    });
  }

  /**
   * Pleasant notification chime when order status updates
   */
  public playNotificationChime() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [659.25, 880, 1174.66]; // E5 -> A5 -> D6 uplifting chime

    notes.forEach((freq, i) => {
      const noteTime = now + i * 0.12;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0, noteTime);
      gain.gain.linearRampToValueAtTime(0.2, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.7);
    });
  }
}

export const templeAudio = new TempleAudio();
