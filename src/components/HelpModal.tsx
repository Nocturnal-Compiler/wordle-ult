'use client'

import Modal from './Modal'

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="How To Play">
      <div className="space-y-4 text-gray-300">
        <p>Guess the <strong className="text-white">WORDLE</strong> in 6 tries.</p>
        
        <p>Each guess must be a valid 5-letter word. Press enter to submit.</p>
        
        <p>After each guess, the color of the tiles will change to show how close your guess was to the word.</p>
        
        <hr className="border-gray-700" />
        
        <div>
          <p className="font-bold text-white mb-2">Examples</p>
          
          {/* Correct example */}
          <div className="flex gap-1 mb-3">
            {['W', 'E', 'A', 'R', 'Y'].map((letter, i) => (
              <div
                key={i}
                className={`w-10 h-10 flex items-center justify-center text-lg font-bold border-2 ${
                  i === 0 ? 'bg-wordle-green border-wordle-green' : 'border-gray-600'
                }`}
              >
                {letter}
              </div>
            ))}
          </div>
          <p className="text-sm mb-4">
            <strong className="text-white">W</strong> is in the word and in the correct spot.
          </p>
          
          {/* Present example */}
          <div className="flex gap-1 mb-3">
            {['P', 'I', 'L', 'L', 'S'].map((letter, i) => (
              <div
                key={i}
                className={`w-10 h-10 flex items-center justify-center text-lg font-bold border-2 ${
                  i === 1 ? 'bg-wordle-yellow border-wordle-yellow' : 'border-gray-600'
                }`}
              >
                {letter}
              </div>
            ))}
          </div>
          <p className="text-sm mb-4">
            <strong className="text-white">I</strong> is in the word but in the wrong spot.
          </p>
          
          {/* Absent example */}
          <div className="flex gap-1 mb-3">
            {['V', 'A', 'G', 'U', 'E'].map((letter, i) => (
              <div
                key={i}
                className={`w-10 h-10 flex items-center justify-center text-lg font-bold border-2 ${
                  i === 3 ? 'bg-wordle-gray border-wordle-gray' : 'border-gray-600'
                }`}
              >
                {letter}
              </div>
            ))}
          </div>
          <p className="text-sm">
            <strong className="text-white">U</strong> is not in the word in any spot.
          </p>
        </div>
        
        <hr className="border-gray-700" />
        
        <div>
          <p className="font-bold text-white mb-2">Game Modes</p>
          <p className="text-sm mb-2">
            <strong className="text-wordle-green">Daily</strong> - A new word every day. Same word for everyone!
          </p>
          <p className="text-sm">
            <strong className="text-wordle-green">Unlimited</strong> - Practice with random words. Play as many times as you want!
          </p>
        </div>
      </div>
    </Modal>
  )
}
