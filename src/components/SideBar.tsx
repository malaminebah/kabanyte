'use client'

import { useState } from 'react'
import Link from 'next/link'

type Board = {
  id: string
  name: string
}

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true)
  const [boards, setBoards] = useState<Board[]>([
    { id: '1', name: 'Project Alpha' },
    { id: '2', name: 'Team Roadmap' },
    { id: '3', name: 'Sprint Planning' },
  ])
  const [newBoardName, setNewBoardName] = useState('')

  const toggleSidebar = () => setIsOpen(!isOpen)

  const handleCreateBoard = (e: React.FormEvent) => {
    e.preventDefault()
    if (newBoardName.trim()) {
      const newBoard: Board = {
        id: Date.now().toString(),
        name: newBoardName.trim()
      }
      setBoards([...boards, newBoard])
      setNewBoardName('')
    }
  }

  return (
    <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white text-grey-700 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center justify-between p-4">
        <h2 className="text-xl font-semibold">Boards</h2>
        <button onClick={toggleSidebar} className="text-gray-400 hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>
      <div className="p-4">
        <form onSubmit={handleCreateBoard} className="mb-4">
          <input
            type="text"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            placeholder="New board name"
            className="w-full px-3 py-2 text-sm text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="w-full mt-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create New Board
          </button>
        </form>
        <nav>
          <ul className="space-y-2">
            {boards.map((board) => (
              <li key={board.id}>
                <Link href={`/board/${board.id}`} className="block px-4 py-2 text-sm rounded-md hover:bg-gray-700">
                  {board.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <button
        onClick={toggleSidebar}
        className={`absolute top-1/2 -right-3 transform -translate-y-1/2 bg-gray-800 text-white p-1 rounded-full ${isOpen ? 'rotate-0' : 'rotate-180'}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    </div>
  )
}

export default Sidebar
