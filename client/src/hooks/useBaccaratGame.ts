import { useState, useCallback, useEffect, useRef } from 'react';
import { 
  Card, 
  createDeck, 
  calculateScore, 
  shouldPlayerDraw, 
  shouldBankerDraw, 
  determineWinner, 
  Winner,
  HandType
} from '@/lib/baccarat-logic';

export interface BetState {
  player: number;
  banker: number;
  tie: number;
}

const DEAL_DELAY = 800; // ms between cards

export function useBaccaratGame(initialBalance: number = 1000000) {
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [bankerHand, setBankerHand] = useState<Card[]>([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [bankerScore, setBankerScore] = useState(0);
  const [gameStatus, setGameStatus] = useState<'betting' | 'dealing' | 'finished'>('betting');
  const [winner, setWinner] = useState<Winner | null>(null);
  const [history, setHistory] = useState<Winner[]>([]);
  
  const [balance, setBalance] = useState(initialBalance);
  const [currentBets, setCurrentBets] = useState<BetState>({ player: 0, banker: 0, tie: 0 });
  const [lastWinAmount, setLastWinAmount] = useState(0);

  // Initialize deck on mount
  useEffect(() => {
    setDeck(createDeck(8));
  }, []);

  // Reshuffle if deck is low
  useEffect(() => {
    if (deck.length < 20 && deck.length > 0) {
      setDeck(createDeck(8));
    }
  }, [deck.length]);

  const placeBet = (type: keyof BetState, amount: number) => {
    if (gameStatus !== 'betting') return;
    if (balance < amount) return; // Not enough funds

    setBalance(prev => prev - amount);
    setCurrentBets(prev => ({
      ...prev,
      [type]: prev[type] + amount
    }));
  };

  const clearBets = () => {
    if (gameStatus !== 'betting') return;
    const totalBet = currentBets.player + currentBets.banker + currentBets.tie;
    setBalance(prev => prev + totalBet);
    setCurrentBets({ player: 0, banker: 0, tie: 0 });
  };

  const dealCard = async (target: HandType, currentDeck: Card[]) => {
    const card = currentDeck.pop();
    if (!card) return null;
    
    // Update deck state immediately to prevent reusing card
    setDeck([...currentDeck]);
    
    if (target === 'player') {
      setPlayerHand(prev => {
        const newHand = [...prev, card];
        setPlayerScore(calculateScore(newHand));
        return newHand;
      });
    } else {
      setBankerHand(prev => {
        const newHand = [...prev, card];
        setBankerScore(calculateScore(newHand));
        return newHand;
      });
    }
    
    return card;
  };

  const startGame = async () => {
    if (currentBets.player === 0 && currentBets.banker === 0 && currentBets.tie === 0) return;
    
    setGameStatus('dealing');
    setWinner(null);
    setPlayerHand([]);
    setBankerHand([]);
    setPlayerScore(0);
    setBankerScore(0);
    setLastWinAmount(0);

    const currentDeck = [...deck];
    
    // Initial Deal: P, B, P, B
    await new Promise(r => setTimeout(r, DEAL_DELAY));
    await dealCard('player', currentDeck);
    
    await new Promise(r => setTimeout(r, DEAL_DELAY));
    await dealCard('banker', currentDeck);
    
    await new Promise(r => setTimeout(r, DEAL_DELAY));
    await dealCard('player', currentDeck);
    
    await new Promise(r => setTimeout(r, DEAL_DELAY));
    await dealCard('banker', currentDeck);

    // Calculate initial scores
    // Note: Scores are updated in dealCard via setState, but we need values here for logic.
    // Since setState is async, we calculate locally for logic flow.
    // Actually, we can't rely on state immediately. 
    // Let's grab the hands from the local variables we would have if we tracked them, 
    // but since we are using async/await with delays, we can't easily access the *updated* state in the same closure without refs or helpers.
    // A better approach for the simulation is to pre-calculate the game result or use a ref to track hands synchronously.
    
    // Refactored approach: Calculate logic based on the cards we just popped.
    // We need to know the cards to apply 3rd card rules.
    // Let's assume the last 4 cards popped were:
    // P1, B1, P2, B2 (in reverse order of pop if we just popped them, but we did it sequentially)
    
    // To keep it simple and robust, let's just read the cards we dealt.
    // We can't read state, so we have to track them in local vars.
    
    // Wait for state updates to settle visually? No, logic runs.
    // Let's restart the logic with local tracking.
  };
  
  // Robust Game Loop
  const runGameSequence = useCallback(async () => {
    if (currentBets.player === 0 && currentBets.banker === 0 && currentBets.tie === 0) return;
    
    setGameStatus('dealing');
    setWinner(null);
    setPlayerHand([]);
    setBankerHand([]);
    setPlayerScore(0);
    setBankerScore(0);
    setLastWinAmount(0);

    const localDeck = [...deck];
    const pHand: Card[] = [];
    const bHand: Card[] = [];

    // Helper to deal and update state
    const dealTo = async (target: HandType) => {
      await new Promise(r => setTimeout(r, DEAL_DELAY));
      const card = localDeck.pop();
      if (!card) return null;
      
      if (target === 'player') {
        pHand.push(card);
        setPlayerHand([...pHand]);
        setPlayerScore(calculateScore(pHand));
      } else {
        bHand.push(card);
        setBankerHand([...bHand]);
        setBankerScore(calculateScore(bHand));
      }
      setDeck([...localDeck]); // Update main deck state
      return card;
    };

    // 1. Initial Deal
    await dealTo('player');
    await dealTo('banker');
    await dealTo('player');
    await dealTo('banker');

    let pScore = calculateScore(pHand);
    let bScore = calculateScore(bHand);
    let pThirdCard: Card | undefined = undefined;

    // 2. Natural Win Check (8 or 9)
    const isNatural = pScore >= 8 || bScore >= 8;

    if (!isNatural) {
      // 3. Player Draw Rule
      if (shouldPlayerDraw(pScore)) {
        const card = await dealTo('player');
        if (card) pThirdCard = card;
        pScore = calculateScore(pHand);
      }

      // 4. Banker Draw Rule
      if (shouldBankerDraw(bScore, pThirdCard)) {
        await dealTo('banker');
        bScore = calculateScore(bHand);
      }
    }

    // 5. Determine Winner
    const result = determineWinner(pScore, bScore);
    setWinner(result);
    setHistory(prev => [...prev, result]);
    setGameStatus('finished');

    // 6. Payout
    let winAmount = 0;
    if (result === 'player') {
      winAmount += currentBets.player * 2; // 1:1
    } else if (result === 'banker') {
      winAmount += currentBets.banker * 1.95; // 1:0.95
    } else if (result === 'tie') {
      winAmount += currentBets.tie * 9; // 1:8 usually, user said 1:8 or 9. Let's use 8 for standard or 9. User said "1:8 or 9". Let's go with 9 (generous) or 8. Standard is 8. Let's use 9 as per "high roller" vibe or stick to 8? User prompt: "1 : 8 또는 9". Let's use 9 for excitement.
      // Also return original bets for P/B on Tie?
      // Standard Baccarat: If Tie, Player/Banker bets push (returned).
      winAmount += currentBets.player;
      winAmount += currentBets.banker;
      winAmount += currentBets.tie; // The bet itself returned + 8x winnings = 9x total? Or 1:8 payout means 8 profit + 1 bet = 9 total.
      // If payout is 1:9, then total return is 10x. If payout is 1:8, total return is 9x.
      // Let's assume 1:8 payout (standard), so return is 9x bet.
    }

    // Handle Push for P/B on Tie
    if (result === 'tie') {
       // Already handled above: returned P/B bets.
    } else {
       // If not tie, losing bets are already gone (deducted at placeBet).
       // Winning bets get returned + profit.
       // My logic above:
       // If P wins: P bet * 2 (1 bet + 1 profit). B/Tie bets lost.
       // If B wins: B bet * 1.95 (1 bet + 0.95 profit). P/Tie bets lost.
    }

    setBalance(prev => prev + winAmount);
    setLastWinAmount(winAmount);

  }, [deck, currentBets]);

  const resetGame = () => {
    setGameStatus('betting');
    setWinner(null);
    setPlayerHand([]);
    setBankerHand([]);
    setPlayerScore(0);
    setBankerScore(0);
    setLastWinAmount(0);
    setCurrentBets({ player: 0, banker: 0, tie: 0 });
    setBalance(initialBalance);
  };

  const setInitialBalance = (newBalance: number) => {
    setBalance(newBalance);
    setGameStatus('betting');
    setWinner(null);
    setPlayerHand([]);
    setBankerHand([]);
    setPlayerScore(0);
    setBankerScore(0);
    setLastWinAmount(0);
    setCurrentBets({ player: 0, banker: 0, tie: 0 });
  };

  return {
    deck,
    playerHand,
    bankerHand,
    playerScore,
    bankerScore,
    gameStatus,
    winner,
    history,
    balance,
    currentBets,
    lastWinAmount,
    placeBet,
    clearBets,
    startGame: runGameSequence,
    resetGame,
    setInitialBalance
  };
}
