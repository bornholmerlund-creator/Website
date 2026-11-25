"""Synthesises the 40 s music bed for the Power BI video (no samples, no licence needed).

Structure follows the story: sparse, slightly tense ticking (data chaos) -> riser at 6 s ->
pad opens and an arpeggio enters (transformation) -> soft groove (solutions / support) ->
drums drop out and a final chord rings out under the logo.

    python3 tools/make_music.py public/music/pbi-bed.wav
"""
import sys
import numpy as np
from scipy.signal import butter, sosfilt

SR = 48000
DUR = 40.0
BPM = 100
BEAT = 60 / BPM
N = int(SR * DUR)
rng = np.random.default_rng(7)

def t_arr(n):
    return np.arange(n) / SR

def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)

def env_adsr(n, a, d, s, r):
    e = np.ones(n) * s
    na, nd, nr = int(a * SR), int(d * SR), int(r * SR)
    na = min(na, n); e[:na] = np.linspace(0, 1, na)
    nd = min(nd, n - na); e[na:na + nd] = np.linspace(1, s, nd)
    if nr > 0 and nr < n:
        e[-nr:] *= np.linspace(1, 0, nr)
    return e

def lp(x, fc, order=2):
    sos = butter(order, min(fc, SR / 2 - 100) / (SR / 2), 'low', output='sos')
    return sosfilt(sos, x)

def hp(x, fc, order=2):
    sos = butter(order, fc / (SR / 2), 'high', output='sos')
    return sosfilt(sos, x)

def saw(f, n, phase=0.0):
    ph = (np.arange(n) * f / SR + phase) % 1.0
    return 2 * ph - 1

L = np.zeros(N); R = np.zeros(N)

def add(sig, start, gain=1.0, pan=0.0):
    i = int(start * SR)
    if i >= N: return
    sig = sig[: N - i]
    gl = gain * np.sqrt((1 - pan) / 2); gr = gain * np.sqrt((1 + pan) / 2)
    L[i:i + len(sig)] += sig * gl
    R[i:i + len(sig)] += sig * gr

def sweep_lp(x, f0, f1, curve=1.0, blocks=400):
    """Time-varying low-pass by processing in blocks (cheap, good enough for pads)."""
    out = np.zeros_like(x); nb = len(x) // blocks + 1
    zi = None
    for b in range(blocks):
        s, e = b * nb, min(len(x), (b + 1) * nb)
        if s >= e: break
        p = (b / blocks) ** curve
        fc = f0 * (f1 / f0) ** p
        sos = butter(2, fc / (SR / 2), 'low', output='sos')
        if zi is None: zi = np.zeros((sos.shape[0], 2))
        out[s:e], zi = sosfilt(sos, x[s:e], zi=zi)
    return out

# ---------- harmony ----------
# 8-beat chords from 6 s: Am9 · Fmaj7 · C(add9) · G6, repeating; final Fmaj9 -> C at the end card.
CH = [
    [57, 60, 64, 67, 71],  # Am9
    [53, 57, 60, 64, 67],  # Fmaj9
    [48, 55, 60, 62, 64],  # Cadd9
    [55, 59, 62, 64, 67],  # G6
]
BASS = [45, 41, 48, 43]
T0 = 6.0
BAR2 = 8 * BEAT  # 4.8 s

def chord_at(t):
    k = int((t - T0) // BAR2)
    return k

# ---------- 1. opening drone (0-6.4 s): low A + fifth, slightly unsettled ----------
n = int(6.8 * SR)
drone = sum(saw(midi(m) * (1 + d), n) for m in (33, 40, 45) for d in (-0.003, 0.003))
drone = sweep_lp(drone, 180, 900, 1.6) * env_adsr(n, 0.4, 0.1, 1.0, 0.8)
add(drone * 0.05, 0.0, 1.0, 0.0)

# fragmented ticking: off-grid clicks, slightly detuned blips, panned around
for k in range(28):
    tt = 0.15 + k * (5.6 / 28) + rng.uniform(-0.04, 0.04)
    nn = int(0.06 * SR)
    f = rng.choice([1567, 1760, 1975, 2349, 1661])
    blip = np.sin(2 * np.pi * f * t_arr(nn)) * np.exp(-t_arr(nn) * 70)
    add(blip * 0.05 * (0.6 + 0.4 * (k / 28)), tt, 1.0, rng.uniform(-0.8, 0.8))

# ---------- 2. riser into the transformation ----------
n = int(1.6 * SR)
noise = rng.standard_normal(n)
riser = sweep_lp(noise, 300, 9000, 1.8) * np.linspace(0, 1, n) ** 2
add(hp(riser, 200) * 0.05, 4.6, 1.0, 0.0)
# soft reverse-ish swell then impact at 6.0
n = int(2.5 * SR)
boom = np.sin(2 * np.pi * 55 * t_arr(n) * (1 + 0.6 * np.exp(-t_arr(n) * 9))) * np.exp(-t_arr(n) * 2.2)
add(boom * 0.22, 6.0)

# ---------- 3. pads from 6 s ----------
end_pad = 40.0
k = 0
t = T0
while t < 34.0:
    ch = CH[k % 4]
    dur = BAR2 + 0.6
    n = int(dur * SR)
    sig = np.zeros(n)
    for m in ch:
        for d in (-0.004, 0.0, 0.004):
            sig += saw(midi(m) * (1 + d), n, rng.random())
    # filter opens over the first 10 s of the transformation and stays open
    prog = min(1.0, (t - T0) / 9.0)
    fc0 = 500 + 2200 * prog
    sig = lp(sig, fc0) * env_adsr(n, 0.5, 0.3, 0.85, 0.7)
    add(sig * 0.018, t, 1.0, -0.15 if k % 2 else 0.15)
    t += BAR2; k += 1
# final chord: Fmaj9 rising to C, long ring under the logo
for (start, ch, dur) in ((t, [53, 57, 60, 64, 67, 72], 2.6), (t + 2.4, [48, 55, 60, 64, 67, 72, 76], 40 - (t + 2.4))):
    n = int(dur * SR)
    sig = sum(saw(midi(m) * (1 + d), n, rng.random()) for m in ch for d in (-0.004, 0.004))
    sig = lp(sig, 2400) * env_adsr(n, 0.3, 0.4, 0.8, min(dur * 0.7, 2.2))
    add(sig * 0.017, start)

# ---------- 4. arpeggio (pluck), from 8.4 s ----------
arp_start = T0 + 2 * BEAT * 2
tt = arp_start
step = BEAT / 2
i = 0
while tt < 37.0:
    ch = CH[chord_at(tt) % 4]
    pattern = [0, 2, 4, 2, 1, 3, 4, 3]
    m = ch[pattern[i % 8]] + 12
    n = int(0.45 * SR)
    x = saw(midi(m), n) * 0.6 + np.sin(2 * np.pi * midi(m) * t_arr(n)) * 0.4
    x = lp(x, 3200) * np.exp(-t_arr(n) * 9)
    g = 0.05 * min(1.0, (tt - arp_start) / 4.0 + 0.3)
    add(x * g, tt, 1.0, 0.35 if i % 2 else -0.35)
    # simple echo
    add(x * g * 0.35, tt + BEAT * 0.75, 1.0, -0.5 if i % 2 else 0.5)
    tt += step; i += 1

# ---------- 5. drums: kick from 10.8 s, hats from 13.2 s, clap from 15.6 s; out at 37.2 ----------
def kick():
    n = int(0.5 * SR); tt_ = t_arr(n)
    f = 48 + 90 * np.exp(-tt_ * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-tt_ * 7) * 0.9

def hat(open_=False):
    n = int((0.18 if open_ else 0.05) * SR)
    x = hp(rng.standard_normal(n), 7000, 4)
    return x * np.exp(-t_arr(n) * (18 if open_ else 80))

def clap():
    n = int(0.25 * SR)
    x = hp(lp(rng.standard_normal(n), 5000), 900)
    e = np.exp(-t_arr(n) * 22)
    for o in (0.0, 0.011, 0.022):
        e += np.roll(np.exp(-t_arr(n) * 90), int(o * SR)) * 0.6
    return x * e * 0.5

K, Hh, Ho, Cl = kick(), hat(), hat(True), clap()
beat = 0
while True:
    tt = T0 + beat * BEAT
    if tt >= 37.2: break
    if tt >= 10.8:
        add(K * 0.32, tt)
    if tt >= 15.6 and beat % 2 == 1:
        add(Cl * 0.12, tt, 1.0, 0.1)
    if tt >= 13.2:
        add(Hh * 0.045, tt + BEAT / 2, 1.0, 0.3)
        if beat % 4 == 3: add(Ho * 0.03, tt + BEAT / 2, 1.0, 0.3)
    if tt >= 19.2:
        add(Hh * 0.025, tt + BEAT / 4, 1.0, -0.3)
        add(Hh * 0.025, tt + 3 * BEAT / 4, 1.0, -0.3)
    beat += 1

# ---------- 6. bass from 10.8 s ----------
tt = 10.8
while tt < 37.2:
    root = BASS[chord_at(tt) % 4]
    for j, off in enumerate((0, 1.5, 2.0, 3.0)):
        s0 = tt + off * BEAT
        if s0 >= 37.2: break
        n = int(0.5 * BEAT * SR * (2 if off == 0 else 1))
        x = saw(midi(root - 12 + (12 if j == 3 else 0)), n) * 0.5 + np.sin(2 * np.pi * midi(root - 12) * t_arr(n))
        x = lp(x, 420) * env_adsr(n, 0.005, 0.12, 0.6, 0.06)
        add(x * 0.09, s0)
    tt += 4 * BEAT

# ---------- 7. shimmer on the logo + final low hit ----------
n = int(5 * SR)
sh = sum(np.sin(2 * np.pi * midi(m) * t_arr(n)) for m in (84, 88, 91, 96)) * env_adsr(n, 1.2, 0.5, 0.7, 2.5)
add(sh * 0.012, 34.6, 1.0, 0.0)
add(boom * 0.16, 37.2)

# ---------- master ----------
mix = np.stack([L, R], axis=1)
# gentle "room": short multi-tap delay as cheap reverb
for d, g in ((0.031, 0.18), (0.047, 0.14), (0.083, 0.1), (0.121, 0.07)):
    s = int(d * SR)
    mix[s:, 0] += mix[:-s, 1] * g
    mix[s:, 1] += mix[:-s, 0] * g
# fade
fade = np.ones(N)
fi = int(0.05 * SR); fade[:fi] = np.linspace(0, 1, fi)
fo = int(1.8 * SR); fade[-fo:] = np.linspace(1, 0, fo) ** 1.5
mix *= fade[:, None]
mix = np.tanh(mix * 1.1) / 1.1
mix /= np.max(np.abs(mix)) / 0.89

from scipy.io import wavfile
wavfile.write(sys.argv[1] if len(sys.argv) > 1 else 'pbi-bed.wav', SR, (mix * 32767).astype(np.int16))
print('ok')
