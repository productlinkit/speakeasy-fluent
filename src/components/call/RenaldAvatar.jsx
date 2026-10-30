import foxWave from "../../assets/fox-wave.webp";

export default function RenaldAvatar({ className = "" }) {
  return (
    <div aria-hidden="true" className={`relative shrink-0 overflow-hidden rounded-full bg-[#fde8d7] ${className}`}>
      <img src={foxWave} alt="" className="absolute top-[-22%] left-1/2 w-[190%] max-w-none -translate-x-1/2" />
    </div>
  );
}
