import RenaldAvatar from "./RenaldAvatar";

export default function CallEndedEarly({ onCallAgain, onClose }) {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col items-center justify-center text-center">
      <RenaldAvatar className="size-28 border-4 border-white/80" />
      <h2 className="mt-5 text-3xl font-bold">Call ended early</h2>
      <p className="mt-3 text-white/80">
        Renald needs a few more answers to write your speaking report. The whole call takes about 2 minutes.
      </p>
      <button
        type="button"
        onClick={onCallAgain}
        className="button-3d mt-6 h-14 w-full rounded-full bg-accent text-lg font-bold text-navy"
      >
        Call Renald again
      </button>
      <button type="button" onClick={onClose} className="mt-4 text-sm font-bold text-white/80 hover:text-white">
        Maybe later
      </button>
    </div>
  );
}
