import { useMemo, useState } from "react";

function randomCard() {
  const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  const suits = ["♠", "♥", "♦", "♣"];
  return `${ranks[Math.floor(Math.random() * ranks.length)]}${suits[Math.floor(Math.random() * suits.length)]}`;
}

function cardValue(card) {
  const rank = card.slice(0, -1);
  if (["J", "Q", "K"].includes(rank)) return 10;
  if (rank === "A") return 11;
  return Number(rank);
}

function handValue(cards) {
  let total = cards.reduce((sum, c) => sum + cardValue(c), 0);
  let aces = cards.filter((c) => c.startsWith("A")).length;

  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }
  return total;
}

export default function SessionPage() {
  const [sessionId] = useState("S-0142");
  const [round, setRound] = useState(1);
  const [bet, setBet] = useState(50);
  const [bankroll, setBankroll] = useState(1000);

  const [dealerCards, setDealerCards] = useState(["?", randomCard()]);
  const [playerCards, setPlayerCards] = useState([randomCard(), randomCard()]);

  const [avgBet, setAvgBet] = useState(0);
  const [lossStreak, setLossStreak] = useState(0);
  const [riskScore, setRiskScore] = useState(0.18);
  const [feedback, setFeedback] = useState("No behaviour change detected yet.");
  const [log, setLog] = useState([{ round: 1, text: "Session started" }]);

  const playerTotal = useMemo(() => handValue(playerCards), [playerCards]);
  const visibleDealerValue = useMemo(
    () => (dealerCards[1] === "?" ? 0 : cardValue(dealerCards[1])),
    [dealerCards]
  );

  function updateMetrics(nextBet, outcome) {
    const nextAvg = avgBet === 0 ? nextBet : Math.round((avgBet + nextBet) / 2);
    setAvgBet(nextAvg);

    const nextLossStreak = outcome === "Loss" ? lossStreak + 1 : 0;
    setLossStreak(nextLossStreak);

    let score = 0.1;
    if (nextBet > nextAvg) score += 0.18;
    if (nextLossStreak >= 2) score += 0.24;
    if (nextBet >= 100) score += 0.15;
    if (round >= 5) score += 0.12;

    score = Math.min(1, Number(score.toFixed(2)));
    setRiskScore(score);

    if (score >= 0.6) {
      setFeedback("Risk pattern rising: increased bets and repeated losses detected.");
    } else if (score >= 0.35) {
      setFeedback("Moderate behavioural change detected.");
    } else {
      setFeedback("No significant behaviour concern detected.");
    }
  }

  function placeBet() {
    setLog((prev) => [{ round, text: `Bet placed: £${bet}` }, ...prev]);
  }

  function hit() {
    const nextCards = [...playerCards, randomCard()];
    setPlayerCards(nextCards);

    const total = handValue(nextCards);
    if (total > 21) {
      const outcome = "Loss";
      setBankroll((prev) => prev - bet);
      updateMetrics(bet, outcome);
      setLog((prev) => [{ round, text: `Hit → bust at ${total}. ${outcome}` }, ...prev]);
    } else {
      setLog((prev) => [{ round, text: `Hit → player total now ${total}` }, ...prev]);
    }
  }

  function stand() {
    const revealedDealer = [randomCard(), dealerCards[1]];
    let dealerHand = [...revealedDealer];

    while (handValue(dealerHand) < 17) {
      dealerHand.push(randomCard());
    }

    setDealerCards(dealerHand);

    const dealerTotal = handValue(dealerHand);
    const player = handValue(playerCards);

    let outcome = "Draw";
    if (dealerTotal > 21 || player > dealerTotal) {
      outcome = "Win";
      setBankroll((prev) => prev + bet);
    } else if (player < dealerTotal) {
      outcome = "Loss";
      setBankroll((prev) => prev - bet);
    }

    updateMetrics(bet, outcome);
    setLog((prev) => [
      { round, text: `Stand → dealer ${dealerTotal}, player ${player}. ${outcome}` },
      ...prev,
    ]);
  }

  function newRound() {
    setRound((r) => r + 1);
    setDealerCards(["?", randomCard()]);
    setPlayerCards([randomCard(), randomCard()]);
    setLog((prev) => [{ round: round + 1, text: "New round started" }, ...prev]);
  }

  function endSession() {
    setFeedback("Session ended. Ready to generate behaviour dashboard.");
    setLog((prev) => [{ round, text: "Session ended" }, ...prev]);
  }

  const volatility = bet >= 100 ? "High" : bet >= 50 ? "Medium" : "Low";

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <div className="brand__dot" />
          <div>
            <p className="brand__eyebrow">Live Session</p>
            <h1 className="brand__title">Blackjack Behaviour Tracking</h1>
          </div>
        </div>

        <div className="topbar__meta">
          <div className="meta-card">
            <span className="meta-card__label">Session ID</span>
            <span className="meta-card__value">{sessionId}</span>
          </div>
          <div className="meta-card">
            <span className="meta-card__label">Round</span>
            <span className="meta-card__value">{String(round).padStart(2, "0")}</span>
          </div>
          <div className="meta-card">
            <span className="meta-card__label">Game</span>
            <span className="meta-card__value">Blackjack</span>
          </div>
        </div>
      </header>

      <main className="layout">
        <section className="game-area">
          <div className="panel">
            <div className="panel__header">
              <h2 className="panel__title">Game Table</h2>
              <span className="status">Session Active</span>
            </div>

            <div className="table">
              <div className="hand-block">
                <p className="hand-block__label">Dealer Hand</p>
                <div className="cards">
                  {dealerCards.map((card, i) => (
                    <div className="card" key={`dealer-${i}`}>{card}</div>
                  ))}
                </div>
                <p className="hand-block__value">Visible Value: {visibleDealerValue}</p>
              </div>

              <div className="table__divider" />

              <div className="hand-block">
                <p className="hand-block__label">Player Hand</p>
                <div className="cards">
                  {playerCards.map((card, i) => (
                    <div className="card" key={`player-${i}`}>{card}</div>
                  ))}
                </div>
                <p className="hand-block__value">Total Value: {playerTotal}</p>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel__header">
              <h2 className="panel__title">Session Controls</h2>
            </div>

            <div className="controls-grid">
              <div className="control-group">
                <label htmlFor="betAmount">Bet Amount</label>
                <input
                  id="betAmount"
                  type="number"
                  min="0"
                  value={bet}
                  onChange={(e) => setBet(Number(e.target.value))}
                />
              </div>

              <div className="control-group control-group--wide">
                <label>Actions</label>
                <div className="button-row">
                  <button className="btn btn--primary" onClick={placeBet}>Place Bet</button>
                  <button className="btn" onClick={hit}>Hit</button>
                  <button className="btn" onClick={stand}>Stand</button>
                  <button className="btn" onClick={newRound}>New Round</button>
                </div>
              </div>
            </div>

            <div className="control-footer">
              <button className="btn btn--danger" onClick={endSession}>End Session</button>
              <button className="btn btn--ghost">View Session Summary</button>
            </div>
          </div>
        </section>

        <aside className="sidebar">
          <div className="panel">
            <div className="panel__header">
              <h2 className="panel__title">Behaviour Signals</h2>
            </div>

            <div className="metric-list">
              <div className="metric">
                <span className="metric__label">Current Risk Score</span>
                <span className="metric__value">{riskScore}</span>
              </div>
              <div className="metric">
                <span className="metric__label">Average Bet</span>
                <span className="metric__value">£{avgBet || 0}</span>
              </div>
              <div className="metric">
                <span className="metric__label">Loss Streak</span>
                <span className="metric__value">{lossStreak}</span>
              </div>
              <div className="metric">
                <span className="metric__label">Bet Volatility</span>
                <span className="metric__value">{volatility}</span>
              </div>
              <div className="metric">
                <span className="metric__label">Bankroll</span>
                <span className="metric__value">£{bankroll}</span>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel__header">
              <h2 className="panel__title">Adaptive Feedback</h2>
            </div>

            <div className="feedback-box">
              <p className="feedback-box__text">{feedback}</p>
              <span className="feedback-box__tag">
                {riskScore >= 0.6
                  ? "High change detected"
                  : riskScore >= 0.35
                  ? "Moderate change detected"
                  : "Low change detected"}
              </span>
            </div>
          </div>

          <div className="panel">
            <div className="panel__header">
              <h2 className="panel__title">Recent Session Log</h2>
            </div>

            <div className="log-list">
              {log.map((item, index) => (
                <div className="log-item" key={`${item.round}-${index}`}>
                  <span className="log-item__round">R{item.round}</span>
                  <span className="log-item__text">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}