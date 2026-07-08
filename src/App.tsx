import { useEffect, useRef, useState } from "react";
import { Game } from "./game/Game";
import type { GameState, Stats } from "./game/types";

const emptyStats: Stats = {
  score: 0,
  best: 0,
  combo: 0,
  comboTimer: 0,
  health: 5,
  maxHealth: 5,
  dash: 1,
  time: 0,
  wave: 1,
};

function fmtTime(t: number) {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game | null>(null);
  const [state, setStateUi] = useState<GameState>("menu");
  const [stats, setStats] = useState<Stats>(emptyStats);
  const [scores, setScores] = useState<number[]>([]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const g = new Game(canvasRef.current);
    gameRef.current = g;
    g.onState((s) => setStateUi(s));
    g.onStats((s) => setStats(s));
    setScores(g.loadScores());
    return () => g.destroy();
  }, []);

  const refreshScores = () => {
    if (gameRef.current) setScores(gameRef.current.loadScores());
  };

  const play = () => gameRef.current?.start();
  const resume = () => gameRef.current?.resume();
  const pause = () => gameRef.current?.pause();
  const restart = () => {
    gameRef.current?.restart();
  };
  const backToMenu = () => {
    refreshScores();
    setStateUi("menu");
  };

  useEffect(() => {
    if (state === "gameover" || state === "menu") refreshScores();
  }, [state]);

  const isNewBest = state === "gameover" && stats.score > 0 && stats.score >= (scores[0] ?? 0);

  return (
    <div className="relative h-[100dvh] w-screen overflow-hidden bg-[#060612] font-sans text-white select-none">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full touch-none" />

      {/* ===== In-game HUD ===== */}
      {(state === "playing" || state === "paused") && (
        <div className="pointer-events-none absolute inset-0 p-3 sm:p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-[10px] font-bold tracking-[0.3em] text-cyan-300/70">SCORE</span>
              </div>
              <div className="font-mono text-3xl font-black tabular-nums text-white drop-shadow-[0_0_10px_rgba(120,240,255,0.5)] sm:text-4xl">
                {stats.score.toLocaleString()}
              </div>
              <div className="mt-0.5 font-mono text-xs text-white/50">
                BEST {Math.max(stats.best, scores[0] ?? 0).toLocaleString()}
              </div>
              {stats.combo >= 2 && (
                <div className="mt-2 inline-flex items-center gap-2">
                  <span
                    key={stats.combo}
                    className="animate-[pop_0.25s_ease] rounded-md bg-amber-400/20 px-2 py-0.5 font-mono text-sm font-black text-amber-300 ring-1 ring-amber-400/40"
                  >
                    ×{stats.combo} COMBO
                  </span>
                  <span className="h-1.5 w-16 overflow-hidden rounded-full bg-white/10">
                    <span
                      className="block h-full rounded-full bg-amber-400 transition-[width] duration-100"
                      style={{ width: `${stats.comboTimer * 100}%` }}
                    />
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col items-end gap-2">
              <button
                onClick={pause}
                className="pointer-events-auto grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-white/20 active:scale-95"
                aria-label="Pause"
              >
                {state === "paused" ? "▶" : "❚❚"}
              </button>
              <div className="mt-24 text-right font-mono text-xs text-white/50 sm:mt-28">
                WAVE {stats.wave} · {fmtTime(stats.time)}
              </div>
            </div>
          </div>

          {/* bottom-left: health + dash */}
          <div className="absolute bottom-4 left-3 sm:left-5">
            <div className="mb-2 flex gap-1.5">
              {Array.from({ length: stats.maxHealth }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2.5 w-6 rounded-full transition-all duration-200 ${
                    i < stats.health
                      ? "bg-gradient-to-r from-rose-500 to-orange-400 shadow-[0_0_8px_rgba(255,120,120,0.7)]"
                      : "bg-white/10"
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold tracking-widest text-cyan-300/70">DASH</span>
              <span className="h-2 w-28 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10">
                <span
                  className={`block h-full rounded-full transition-[width] duration-75 ${
                    stats.dash >= 1
                      ? "bg-gradient-to-r from-cyan-400 to-sky-300 shadow-[0_0_8px_rgba(120,220,255,0.8)]"
                      : "bg-cyan-500/50"
                  }`}
                  style={{ width: `${stats.dash * 100}%` }}
                />
              </span>
            </div>
          </div>

          {/* mobile dash button */}
          <button
            onClick={() => gameRef.current?.triggerDash()}
            className={`pointer-events-auto absolute bottom-8 right-6 grid h-24 w-24 place-items-center rounded-full text-center font-black tracking-widest transition active:scale-90 sm:hidden ${
              stats.dash >= 1
                ? "bg-cyan-400/25 text-cyan-200 ring-2 ring-cyan-300/60 shadow-[0_0_24px_rgba(120,220,255,0.5)]"
                : "bg-white/5 text-white/30 ring-2 ring-white/10"
            }`}
          >
            DASH
          </button>
        </div>
      )}

      {/* ===== Start screen ===== */}
      {state === "menu" && (
        <Overlay>
          <div className="animate-[rise_0.5s_ease] text-center">
            <p className="mb-2 text-[11px] font-bold tracking-[0.5em] text-cyan-300/70">SAYANOX PRESENTS</p>
            <h1 className="bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-amber-300 bg-clip-text text-6xl font-black tracking-tight text-transparent drop-shadow-[0_0_30px_rgba(150,220,255,0.35)] sm:text-8xl">
              NEON FRONTIER
            </h1>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/60">
              Fly the open frontier. Collect energy crystals, dash through raiders to shatter them, and chase the
              high score before the swarm overwhelms you.
            </p>

            <button
              onClick={play}
              className="group mt-8 inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-10 py-4 text-lg font-black tracking-wide text-[#08081a] shadow-[0_0_40px_rgba(150,200,255,0.4)] transition hover:scale-105 active:scale-95"
            >
              ▶ PLAY
            </button>

            <div className="mt-8 grid grid-cols-2 gap-3 text-left sm:mx-auto sm:max-w-lg">
              <Card title="MOVE">
                <Kbd>W A S D</Kbd> / <Kbd>↑ ← ↓ →</Kbd> <span className="text-white/40">·</span> left-stick (touch)
              </Card>
              <Card title="DASH">
                <Kbd>Space</Kbd> / <Kbd>Shift</Kbd> <span className="text-white/40">·</span> right-tap (touch)
              </Card>
              <Card title="COLLECT">
                Fly over <span className="text-cyan-300">crystals</span> — big gold ones heal & score big
              </Card>
              <Card title="DESTROY">
                <span className="text-rose-300">Dash</span> into raiders to shatter them & build combos
              </Card>
            </div>

            {scores.length > 0 && (
              <div className="mx-auto mt-6 max-w-xs rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                <p className="mb-2 text-[10px] font-bold tracking-[0.3em] text-amber-300/70">HIGH SCORES</p>
                <ol className="space-y-1">
                  {scores.map((s, i) => (
                    <li key={i} className="flex justify-between font-mono text-sm">
                      <span className="text-white/40">
                        {["🥇", "🥈", "🥉", "4", "5"][i]}
                      </span>
                      <span className="tabular-nums text-white/80">{s.toLocaleString()}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </Overlay>
      )}

      {/* ===== Pause ===== */}
      {state === "paused" && (
        <Overlay>
          <div className="animate-[pop_0.25s_ease] text-center">
            <h2 className="text-5xl font-black tracking-tight text-white">PAUSED</h2>
            <p className="mt-2 font-mono text-white/50">Score {stats.score.toLocaleString()}</p>
            <div className="mt-8 flex flex-col items-center gap-3">
              <Btn onClick={resume} primary>
                ▶ RESUME
              </Btn>
              <Btn onClick={restart}>↻ RESTART</Btn>
              <Btn onClick={backToMenu}>⌂ MENU</Btn>
            </div>
          </div>
        </Overlay>
      )}

      {/* ===== Game over ===== */}
      {state === "gameover" && (
        <Overlay>
          <div className="animate-[rise_0.4s_ease] text-center">
            {isNewBest && (
              <p className="mb-2 animate-[pop_0.4s_ease] text-sm font-black tracking-[0.4em] text-amber-300 drop-shadow-[0_0_16px_rgba(255,210,120,0.6)]">
                ★ NEW HIGH SCORE ★
              </p>
            )}
            <h2 className="text-5xl font-black tracking-tight text-rose-300 drop-shadow-[0_0_24px_rgba(255,100,140,0.5)] sm:text-6xl">
              GAME OVER
            </h2>
            <div className="mt-6 flex items-center justify-center gap-8">
              <div>
                <div className="text-[10px] font-bold tracking-[0.3em] text-cyan-300/70">SCORE</div>
                <div className="font-mono text-4xl font-black tabular-nums">{stats.score.toLocaleString()}</div>
              </div>
              <div className="h-12 w-px bg-white/15" />
              <div>
                <div className="text-[10px] font-bold tracking-[0.3em] text-amber-300/70">BEST</div>
                <div className="font-mono text-4xl font-black tabular-nums text-white/80">
                  {(scores[0] ?? 0).toLocaleString()}
                </div>
              </div>
            </div>
            <p className="mt-3 font-mono text-xs text-white/40">
              Survived {fmtTime(stats.time)} · reached wave {stats.wave}
            </p>

            <div className="mt-8 flex flex-col items-center gap-3">
              <Btn onClick={restart} primary>
                ↻ PLAY AGAIN
              </Btn>
              <Btn onClick={backToMenu}>⌂ MENU</Btn>
            </div>
          </div>
        </Overlay>
      )}

      <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-medium tracking-[0.3em] text-white/25">
        A SAYANOX GAME
      </div>
    </div>
  );
}

function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 grid place-items-center overflow-y-auto bg-[#060612]/70 px-5 py-10 backdrop-blur-md">
      {children}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white/5 p-3 text-xs leading-relaxed text-white/60 ring-1 ring-white/10">
      <div className="mb-1 text-[10px] font-bold tracking-[0.25em] text-fuchsia-300/70">{title}</div>
      {children}
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded-md bg-white/10 px-1.5 py-0.5 font-mono text-[11px] text-white/80 ring-1 ring-white/15">
      {children}
    </kbd>
  );
}

function Btn({
  children,
  onClick,
  primary,
}: {
  children: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-56 rounded-2xl px-8 py-3.5 text-base font-black tracking-wide transition active:scale-95 ${
        primary
          ? "bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-[#08081a] shadow-[0_0_30px_rgba(150,200,255,0.4)] hover:scale-105"
          : "bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20"
      }`}
    >
      {children}
    </button>
  );
}
