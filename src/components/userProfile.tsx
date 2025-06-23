'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Trophy, Flame, Target, Star, Award, Zap } from 'lucide-react'
type Achievement = {
  id: number
  name: string
  icon: string
  color: string
}

type User = {
  id: string
  name: string
  level: number
  xp: number
  nextLevelXP: number
  streak: number
  problemsSolved: number
  rank: string
  avatar: string
  achievements: Achievement[]
}

const UserProfile: React.FC = () => {
  const userStats: User = {
    id: '1',
    name: 'John Doe',
    level: 42,
    xp: 15420,
    nextLevelXP: 18000,
    streak: 15,
    problemsSolved: 287,
    rank: 'Code Warrior',
    avatar: 'JD',
    achievements: [
      { id: 1, name: 'First Blood', icon: '🎯', color: 'text-neon-green' },
      { id: 2, name: 'Speed Demon', icon: '⚡', color: 'text-neon-blue' },
      { id: 3, name: 'Helper', icon: '🤝', color: 'text-neon-purple' },
      { id: 4, name: 'Streak Master', icon: '🔥', color: 'text-neon-pink' },
    ]
  }

  const xpProgress = (userStats.xp / userStats.nextLevelXP) * 100

  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Profile Card */}
      <div className="cyber-card">
        <div className="text-center">
          <div className="relative mx-auto w-24 h-24 mb-4">
            <div className="w-full h-full bg-gradient-to-r from-neon-green to-neon-blue rounded-full p-1">
              <div className="w-full h-full bg-cyber-black rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-neon-green">{userStats.avatar}</span>
              </div>
            </div>
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-neon-purple to-neon-pink rounded-full w-8 h-8 flex items-center justify-center">
              <span className="text-xs font-bold">{userStats.level}</span>
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-1">{userStats.name}</h3>
          <p className="text-neon-green font-semibold mb-2">{userStats.rank}</p>
          
          {/* XP Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>XP: {userStats.xp}</span>
              <span>Next: {userStats.nextLevelXP}</span>
            </div>
            <div className="level-bar">
              <motion.div
                className="level-progress"
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="cyber-card text-center"
        >
          <Flame className="w-8 h-8 text-neon-pink mx-auto mb-2" />
          <p className="text-2xl font-bold text-neon-pink">{userStats.streak}</p>
          <p className="text-xs text-gray-400">Day Streak</p>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="cyber-card text-center"
        >
          <Target className="w-8 h-8 text-neon-blue mx-auto mb-2" />
          <p className="text-2xl font-bold text-neon-blue">{userStats.problemsSolved}</p>
          <p className="text-xs text-gray-400">Problems Solved</p>
        </motion.div>
      </div>

      {/* Achievements */}
      <div className="cyber-card">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Award className="w-5 h-5 text-neon-green mr-2" />
          Recent Achievements
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {userStats.achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              whileHover={{ scale: 1.1 }}
              className="bg-cyber-dark rounded-lg p-3 text-center hover-glow cursor-pointer"
            >
              <div className="text-2xl mb-1">{achievement.icon}</div>
              <p className={`text-xs font-semibold ${achievement.color}`}>
                {achievement.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full cyber-button flex items-center justify-center space-x-2"
        >
          <Zap className="w-5 h-5" />
          <span>Join Coding Room</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full px-4 py-2 bg-cyber-gray border border-neon-purple/30 rounded-lg text-white hover:border-neon-purple/60 transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <Trophy className="w-5 h-5" />
          <span>View Profile</span>
        </motion.button>
      </div>
    </motion.div>
  )
}

export default UserProfile