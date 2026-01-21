
export default function PlayerCard({ card, called }) { return ( <div> <h4>Your Cartela</h4> <div className="card-grid"> {card.flat().map((n, i) => ( <div key={i} className={called.includes(n) ? "card-cell marked" : "card-cell"}> {n} </div> ))} </div> </div> ); } 
