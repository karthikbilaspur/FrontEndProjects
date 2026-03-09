// src/app/page.tsx
import GameBoard from '../components/GameBoard'; // Adjust path if needed

// This is a Server Component, but it renders a Client Component (GameBoard)
// All the interactivity lives within GameBoard.
export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <GameBoard />
    </main>
  );
}