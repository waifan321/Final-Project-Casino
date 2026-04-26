import { useMemo, useState } from "react";
import { supabase } from "./lib/supabase";

function createDeck() {
  const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  const suits = ["♠", "♥", "♦", "♣"];
  const deck = [];

  ranks.forEach((rank) => {
    suits.forEach((suit) => {
      deck.push(`${rank}${suit}`);
    });
  });

  return deck.sort(() => Math.random() - 0.5);
}

function cardValue(card) {
  if (!card || card === "?") return 0;
  const rank = card.slice(0, -1);
  if (["J", "Q", "K"].includes(rank)) return 10;
  if (rank === "A") return 11;
  return Number(rank);
}

function handValue(cards) {
  let total = cards.reduce((sum, card) => sum + cardValue(card), 0);
  let aces = cards.filter((card) => card.startsWith("A")).length;

  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }

  return total;
}

function isBlackjack(cards) {
  return cards.length === 2 && handValue(cards) === 21;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function SessionPage({ user, onBackToDashboard, onLogout }) {
  const [sessionId] = useState(`S-${Math.floor(Math.random() * 9000 + 1000)}`);

  const [deck, setDeck] = useState(createDeck());
  const [round, setRound] = useState(1);
  const [bankroll, setBankroll] = useState(1000);
  const [bet, setBet] = useState(50);
  const [activeBet, setActiveBet] = useState(0);

  const [roundActive, setRoundActive] = useState(false);
  const [roundEnded, setRoundEnded] = useState(false);
  const [dealerResolving, setDealerResolving] = useState(false);

  const [dealerCards, setDealerCards] = useState([]);
  const [hiddenDealerCard, setHiddenDealerCard] = useState(null);
  const [playerCards, setPlayerCards] = useState([]);

  const [betsPlaced, setBetsPlaced] = useState([]);
  const [lossStreak, setLossStreak] = useState(0);
  const [riskScore, setRiskScore] = useState(0.18);
  const [feedback, setFeedback] = useState("No behaviour change detected yet.");
  const [message, setMessage] = useState("Place a bet to begin the round.");
  const [log, setLog] = useState([{ round: 1, text: "Session started" }]);

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const playerTotal = useMemo(() => handValue(playerCards), [playerCards]);

  const visibleDealerValue = useMemo(() => {
    if (dealerCards.length === 0) return 0;
    return handValue(dealerCards.filter((card) => card !== "?"));
  }, [dealerCards]);

  const avgBet =
    betsPlaced.length > 0
      ? Math.round(betsPlaced.reduce((sum, value) => sum + value, 0) / betsPlaced.length)
      : 0;

  const volatility = activeBet >= 100 ? "High" : activeBet >= 50 ? "Medium" : "Low";
  const cardsRemaining = deck.length;
  const cardsUsed = 52 - deck.length;
  const deckPercentage = Math.round((cardsRemaining / 52) * 100);

  function drawCardFromDeck(currentDeck) {
    let workingDeck = [...currentDeck];

    if (workingDeck.length === 0) {
      workingDeck = createDeck();
      setMessage("Deck was empty, so it has been reshuffled.");
    }

    const card = workingDeck[0];
    const remainingDeck = workingDeck.slice(1);

    return { card, remainingDeck };
  }

  function dealStartingHands() {
    let workingDeck = [...deck];

    if (workingDeck.length < 4) {
      workingDeck = createDeck();
      setMessage("Deck was low, so it has been reshuffled for a new round.");
    }

    const d1 = drawCardFromDeck(workingDeck);
    const d2 = drawCardFromDeck(d1.remainingDeck);
    const p1 = drawCardFromDeck(d2.remainingDeck);
    const p2 = drawCardFromDeck(p1.remainingDeck);

    setDeck(p2.remainingDeck);

    return {
      dealer: ["?", d2.card],
      hiddenDealerCard: d1.card,
      player: [p1.card, p2.card],
    };
  }

  function drawOneCard() {
    const result = drawCardFromDeck(deck);
    setDeck(result.remainingDeck);
    return result.card;
  }

  function updateMetrics(nextBet, outcome) {
    const nextLossStreak = outcome === "Loss" ? lossStreak + 1 : 0;
    setLossStreak(nextLossStreak);

    let score = 0.1;
    if (avgBet > 0 && nextBet > avgBet) score += 0.18;
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

  function startNextRound() {
    if (bankroll <= 0) {
      setMessage("You have no money left. Please end the session.");
      return;
    }

    setRound((prev) => prev + 1);
    setDealerCards([]);
    setHiddenDealerCard(null);
    setPlayerCards([]);
    setActiveBet(0);
    setRoundActive(false);
    setRoundEnded(false);
    setDealerResolving(false);
    setMessage("Place a bet to begin the next round.");
    setSaveMessage("");
  }

  function placeBet() {
    const betValue = Number(bet);

    if (bankroll <= 0) {
      setMessage("You have no money left. Please end the session.");
      return;
    }

    if (!betValue || betValue <= 0) {
      setMessage("Please enter a valid bet amount.");
      return;
    }

    if (betValue > bankroll) {
      setMessage(`Invalid bet. Your bankroll is only £${bankroll}.`);
      return;
    }

    const hands = dealStartingHands();

    setActiveBet(betValue);
    setBetsPlaced((prev) => [...prev, betValue]);

    setDealerCards(hands.dealer);
    setHiddenDealerCard(hands.hiddenDealerCard);
    setPlayerCards(hands.player);

    setRoundActive(true);
    setRoundEnded(false);
    setMessage("Cards dealt. Choose Hit, Stand, or Double.");
    setSaveMessage("");

    setLog((prev) => [{ round, text: `Bet placed: £${betValue}` }, ...prev]);

    if (isBlackjack(hands.player)) {
      const fullDealerHand = [hands.hiddenDealerCard, hands.dealer[1]];
      setDealerCards(fullDealerHand);
      finishRound("Win", fullDealerHand, hands.player, betValue);
    }
  }

  function finishRound(outcome, finalDealerCards, finalPlayerCards, finalBet = activeBet) {
    setRoundActive(false);
    setRoundEnded(true);
    setDealerResolving(false);

    const playerBlackjack = isBlackjack(finalPlayerCards);
    const dealerTotal = handValue(finalDealerCards);
    const playerTotalFinal = handValue(finalPlayerCards);

    let bankrollChange = 0;
    let payoutText = "";

    if (outcome === "Win") {
      if (playerBlackjack) {
        bankrollChange = finalBet * 1.5;
        payoutText = "Blackjack payout: 1.5x bet";
      } else {
        bankrollChange = finalBet;
        payoutText = "Standard win payout: 1x bet";
      }
    } else if (outcome === "Loss") {
      bankrollChange = -finalBet;
      payoutText = "Loss: bet deducted";
    } else {
      bankrollChange = 0;
      payoutText = "Draw: bet returned";
    }

    setBankroll((prev) => Math.max(prev + bankrollChange, 0));
    updateMetrics(finalBet, outcome);

    if (bankroll - finalBet <= 0 && outcome === "Loss") {
      setMessage(
        `Round ended: ${outcome}. Player ${playerTotalFinal}, Dealer ${dealerTotal}. ${payoutText}. You have no money left. Please end the session.`
      );
    } else {
      setMessage(
        `Round ended: ${outcome}. Player ${playerTotalFinal}, Dealer ${dealerTotal}. ${payoutText}. Click "Start Next Round".`
      );
    }
    
    setLog((prev) => [
      {
        round,
        text: `Round ended → Player ${playerTotalFinal}, Dealer ${dealerTotal}. ${outcome}. ${payoutText}`,
      },
      ...prev,
    ]);
  }

  async function revealDealerAndResolve(currentPlayerCards, finalBet = activeBet) {
    setDealerResolving(true);
    setMessage("Dealer reveals hidden card...");

    let workingDeck = [...deck]; // ✅ LOCAL DECK
    let fullDealerHand = [hiddenDealerCard, dealerCards[1]];

    setDealerCards(fullDealerHand);
    await wait(700);

    while (handValue(fullDealerHand) < 17) {
      if (workingDeck.length === 0) {
        workingDeck = createDeck();
        setMessage("Deck reshuffled.");
        await wait(700);
      }

      setMessage("Dealer draws a card...");

      const nextCard = workingDeck[0];   // ✅ TAKE CARD
      workingDeck = workingDeck.slice(1); // ✅ REMOVE CARD

      fullDealerHand = [...fullDealerHand, nextCard];
      setDealerCards(fullDealerHand);

      await wait(700);
    }

    setDeck(workingDeck); // ✅ UPDATE ONCE

    const dealerTotal = handValue(fullDealerHand);
    const playerTotalFinal = handValue(currentPlayerCards);

    let outcome = "Draw";

    if (playerTotalFinal > 21) outcome = "Loss";
    else if (dealerTotal > 21 || playerTotalFinal > dealerTotal) outcome = "Win";
    else if (playerTotalFinal < dealerTotal) outcome = "Loss";

    finishRound(outcome, fullDealerHand, currentPlayerCards, finalBet);
}

  function hit() {
    if (!roundActive || dealerResolving) return;

    const nextCard = drawOneCard();
    const nextCards = [...playerCards, nextCard];
    setPlayerCards(nextCards);

    const total = handValue(nextCards);

    if (total > 21) {
      const fullDealerHand = [hiddenDealerCard, dealerCards[1]];
      setDealerCards(fullDealerHand);
      finishRound("Loss", fullDealerHand, nextCards);
      return;
    }

    setMessage(`Hit taken. Player total is now ${total}.`);
    setLog((prev) => [{ round, text: `Hit → player total ${total}` }, ...prev]);
  }

  async function stand() {
    if (!roundActive || dealerResolving) return;
    await revealDealerAndResolve(playerCards);
  }

  async function doubleDown() {
    if (!roundActive || dealerResolving) return;

    const doubledBet = activeBet * 2;

    if (doubledBet > bankroll) {
      setMessage("You do not have enough bankroll to double.");
      return;
    }

    const nextCard = drawOneCard();
    const nextCards = [...playerCards, nextCard];
    setPlayerCards(nextCards);
    setActiveBet(doubledBet);

    setLog((prev) => [
      { round, text: `Double down → bet increased to £${doubledBet}, drew one card` },
      ...prev,
    ]);

    if (handValue(nextCards) > 21) {
      const fullDealerHand = [hiddenDealerCard, dealerCards[1]];
      setDealerCards(fullDealerHand);
      finishRound("Loss", fullDealerHand, nextCards, doubledBet);
      return;
    }

    await revealDealerAndResolve(nextCards, doubledBet);
  }

  async function endSession() {
    if (saving) return;

    setSaving(true);
    setSaveMessage("");
    setFeedback("Session ended. Saving session data...");

    try {
      const sessionProfit = bankroll - 1000;

      const sessionPayload = {
        user_id: user.id,
        game_type: "blackjack",
        rounds_played: round,
        avg_bet: avgBet || 0,
        final_bankroll: bankroll,
        risk_score: riskScore,
        session_log: log,
      };

      const { error: sessionError } = await supabase.from("sessions").insert(sessionPayload);
      if (sessionError) throw sessionError;

      const newSessionsPlayed = (user.sessions_played || 0) + 1;

      const newAvgBet =
        user.sessions_played && user.sessions_played > 0
          ? Number(
              (
                ((user.avg_bet || 0) * user.sessions_played + (avgBet || 0)) /
                newSessionsPlayed
              ).toFixed(2)
            )
          : avgBet || 0;

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          sessions_played: newSessionsPlayed,
          avg_bet: newAvgBet,
          risk_score: riskScore,
          total_profit: (user.total_profit || 0) + sessionProfit,
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      setFeedback("Session saved successfully.");
      setSaveMessage("Session data saved and profile updated.");
      onBackToDashboard();
    } catch (err) {
      console.error("Failed to save session:", err);
      setFeedback("Session ended, but saving failed.");
      setSaveMessage(err.message || "Failed to save session.");
    }

    setSaving(false);
  }

  return (
    <div className="session-page">
      <header className="session-topbar">
        <div className="session-brand">
          <div className="session-brand__dot"></div>
          <div>
            <p className="session-brand__eyebrow">Live Session</p>
            <h1 className="session-brand__title">Blackjack Behaviour Tracking</h1>
          </div>
        </div>

        <div className="session-topbar__meta">
          <div className="session-meta-card">
            <span className="session-meta-card__label">Session ID</span>
            <span className="session-meta-card__value">{sessionId}</span>
          </div>

          <div className="session-meta-card">
            <span className="session-meta-card__label">Round</span>
            <span className="session-meta-card__value">{String(round).padStart(2, "0")}</span>
          </div>

          <div className="session-meta-card">
            <span className="session-meta-card__label">Bankroll</span>
            <span className="session-meta-card__value">£{bankroll}</span>
          </div>

          <button
            className="session-btn session-btn--ghost"
            onClick={endSession}
            disabled={saving || roundActive}
          >
            {saving ? "Saving..." : "Back to Dashboard"}
          </button>

          <button className="session-btn session-btn--danger" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="session-layout">
        <section className="session-game-area">
          <div className="session-panel">
            <div className="session-panel__header">
              <h2 className="session-panel__title">Game Table</h2>
              <span className="session-status">
                {roundActive ? "Round Active" : roundEnded ? "Round Ended" : "Waiting for Bet"}
              </span>
            </div>

            <div className="session-table">
              <div className="session-hand-block">
                <p className="session-hand-block__label">Dealer Hand</p>
                <div className="session-cards">
                  {dealerCards.length > 0 ? (
                    dealerCards.map((card, i) => (
                      <div
                        className={`session-card ${
                          card.includes("♥") || card.includes("♦") ? "red" : "black"
                        }`}
                        key={`player-${i}`}
                      >
                        {card}
                      </div>
                    ))
                  ) : (
                    <div className="session-card session-card--hidden">?</div>
                  )}
                </div>
                <p className="session-hand-block__value">Visible Value: {visibleDealerValue}</p>
              </div>

              <div className="session-table__divider"></div>

              <div className="session-hand-block">
                <p className="session-hand-block__label">Player Hand</p>
                <div className="session-cards">
                  {playerCards.length > 0 ? (
                    playerCards.map((card, i) => (
                      <div
                        className={`session-card ${
                          card.includes("♥") || card.includes("♦") ? "red" : "black"
                        }`}
                        key={`player-${i}`}
                      >
                        {card}
                      </div>
                    ))
                  ) : (
                    <div className="session-card session-card--hidden">?</div>
                  )}
                </div>
                <p className="session-hand-block__value">
                  Total Value: {playerCards.length > 0 ? playerTotal : 0}
                </p>
              </div>
            </div>
          </div>

          <div className="session-panel">
            <div className="session-panel__header">
              <h2 className="session-panel__title">Session Controls</h2>
            </div>

            <p className="session-message">{message}</p>

            {!roundActive && !roundEnded && (
              <div className="session-controls-grid">
                <div className="session-control-group">
                  <label htmlFor="betAmount">Bet Amount</label>
                  <input
                    id="betAmount"
                    type="number"
                    min="1"
                    max={bankroll}
                    value={bet}
                    onChange={(e) => setBet(Number(e.target.value))}
                    disabled={bankroll <= 0}
                  />
                </div>

                <div className="session-control-group session-control-group--wide">
                  <label>Bet</label>
                  <div className="session-button-row">
                    <button
                      className="session-btn session-btn--primary"
                      onClick={placeBet}
                      disabled={bankroll <= 0}
                    >
                      Place Bet
                    </button>
                  </div>
                </div>
              </div>
            )}

            {roundActive && (
              <div className="session-control-group session-control-group--wide">
                <label>Actions</label>
                <div className="session-button-row">
                  <button className="session-btn" onClick={hit} disabled={dealerResolving}>
                    Hit
                  </button>
                  <button className="session-btn" onClick={stand} disabled={dealerResolving}>
                    Stand
                  </button>
                  <button className="session-btn" onClick={doubleDown} disabled={dealerResolving}>
                    Double
                  </button>
                </div>
              </div>
            )}

            <div className="session-control-footer">
              {roundEnded && bankroll > 0 && (
                <button
                  className="session-btn session-btn--primary"
                  onClick={startNextRound}
                >
                  Start Next Round
                </button>
              )}

              {!roundActive && (
                <button className="session-btn session-btn--danger" onClick={endSession} disabled={saving}>
                  {saving ? "Saving..." : "End Session"}
                </button>
              )}
            </div>
            {saveMessage && <p className="session-message">{saveMessage}</p>}
          </div>

          <div className="session-panel deck-panel">
            <div className="session-panel__header">
              <h2 className="session-panel__title">Deck Status</h2>
              <span className="session-status">{cardsRemaining} cards left</span>
            </div>

            <div className="deck-visual">
              <div className="deck-stack">
                <div className="deck-card deck-card--back"></div>
                <div className="deck-card deck-card--back"></div>
                <div className="deck-card deck-card--back"></div>
              </div>

              <div className="deck-info">
                <p className="deck-info__main">{cardsRemaining} / 52 cards remaining</p>
                <p className="deck-info__sub">{cardsUsed} cards used from current deck</p>

                <div className="deck-progress">
                  <div className="deck-progress__fill" style={{ width: `${deckPercentage}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside className="session-sidebar">
          <div className="session-panel">
            <div className="session-panel__header">
              <h2 className="session-panel__title">Behaviour Signals</h2>
            </div>

            <div className="session-metric-list">
              <div className="session-metric">
                <span className="session-metric__label">Current Risk Score</span>
                <span className="session-metric__value">{riskScore}</span>
              </div>

              <div className="session-metric">
                <span className="session-metric__label">Average Bet</span>
                <span className="session-metric__value">£{avgBet || 0}</span>
              </div>

              <div className="session-metric">
                <span className="session-metric__label">Loss Streak</span>
                <span className="session-metric__value">{lossStreak}</span>
              </div>

              <div className="session-metric">
                <span className="session-metric__label">Bet Volatility</span>
                <span className="session-metric__value">{volatility}</span>
              </div>

              <div className="session-metric">
                <span className="session-metric__label">Active Bet</span>
                <span className="session-metric__value">£{activeBet}</span>
              </div>
            </div>
          </div>

          <div className="session-panel">
            <div className="session-panel__header">
              <h2 className="session-panel__title">Adaptive Feedback</h2>
            </div>

            <div className="session-feedback-box">
              <p className="session-feedback-box__text">{feedback}</p>
              <span className="session-feedback-box__tag">
                {riskScore >= 0.6
                  ? "High change detected"
                  : riskScore >= 0.35
                  ? "Moderate change detected"
                  : "Low change detected"}
              </span>
            </div>
          </div>

          <div className="session-panel">
            <div className="session-panel__header">
              <h2 className="session-panel__title">Recent Session Log</h2>
            </div>

            <div className="session-log-list">
              {log.map((item, index) => {
                const text = item.text.toLowerCase();

                let type = "";
                if (text.includes("win")) type = "win";
                else if (text.includes("loss")) type = "loss";
                else if (text.includes("draw")) type = "draw";

                return (
                  <div className={`session-log-item ${type}`} key={`${item.round}-${index}`}>
                    <span className="session-log-item__round">R{item.round}</span>
                    <span className="session-log-item__text">{item.text}</span>
                    {type && <span className={`session-log-badge ${type}`}>{type.toUpperCase()}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}