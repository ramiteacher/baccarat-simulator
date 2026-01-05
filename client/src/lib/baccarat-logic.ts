export type CardSuit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type CardRank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  suit: CardSuit;
  rank: CardRank;
  value: number;
  id: string; // Unique ID for React keys
}

export type HandType = 'player' | 'banker';
export type Winner = 'player' | 'banker' | 'tie';

export interface GameState {
  deck: Card[];
  playerHand: Card[];
  bankerHand: Card[];
  playerScore: number;
  bankerScore: number;
  winner: Winner | null;
  gameStatus: 'betting' | 'dealing' | 'finished';
  history: Winner[];
}

// Create a standard 52-card deck (multiplied by decks count, usually 8 for Baccarat)
export const createDeck = (decks: number = 8): Card[] => {
  const suits: CardSuit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
  const ranks: CardRank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const deck: Card[] = [];

  for (let d = 0; d < decks; d++) {
    for (const suit of suits) {
      for (const rank of ranks) {
        let value = 0;
        if (['10', 'J', 'Q', 'K'].includes(rank)) {
          value = 0;
        } else if (rank === 'A') {
          value = 1;
        } else {
          value = parseInt(rank);
        }
        
        deck.push({
          suit,
          rank,
          value,
          id: `${d}-${suit}-${rank}-${Math.random().toString(36).substr(2, 9)}`
        });
      }
    }
  }
  return shuffleDeck(deck);
};

// Fisher-Yates shuffle
export const shuffleDeck = (deck: Card[]): Card[] => {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
};

export const calculateScore = (hand: Card[]): number => {
  const sum = hand.reduce((acc, card) => acc + card.value, 0);
  return sum % 10;
};

// Baccarat Third Card Rules
export const shouldPlayerDraw = (playerScore: number): boolean => {
  return playerScore <= 5;
};

export const shouldBankerDraw = (bankerScore: number, playerThirdCard?: Card): boolean => {
  if (bankerScore <= 2) return true;
  if (bankerScore >= 7) return false;

  // If player didn't draw a third card, banker stands on 6 or 7, draws on 0-5
  if (!playerThirdCard) {
    return bankerScore <= 5;
  }

  const p3 = playerThirdCard.value;

  if (bankerScore === 3) {
    return p3 !== 8; // Draw unless player's 3rd card is 8
  }
  if (bankerScore === 4) {
    return [2, 3, 4, 5, 6, 7].includes(p3); // Draw if player's 3rd is 2-7
  }
  if (bankerScore === 5) {
    return [4, 5, 6, 7].includes(p3); // Draw if player's 3rd is 4-7
  }
  if (bankerScore === 6) {
    return [6, 7].includes(p3); // Draw if player's 3rd is 6 or 7
  }

  return false;
};

export const determineWinner = (playerScore: number, bankerScore: number): Winner => {
  if (playerScore > bankerScore) return 'player';
  if (bankerScore > playerScore) return 'banker';
  return 'tie';
};
