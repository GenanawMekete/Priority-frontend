export default function TopBar({ user, roomId }) {
  return (
    <div className="top-bar">
      <div>Room: {roomId}</div>
      <div>User: {user.firstName}</div>
      <div>Balance: {user.balance} ETB</div>
    </div>
  );
}
