import Wallet from "./Wallet";

export default function TopBar() {
  return (
    <div className="top-bar">
      <div className="box">Players: LIVE</div>
      <Wallet />
      <div className="box">Bet: 10</div>
    </div>
  );
}