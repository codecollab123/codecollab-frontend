import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Trophy, 
  Star, 
  Code, 
  MessageSquare, 
  Heart, 
  BookOpen, 
  Calendar,
  Flag,
  User,
  CheckCircle
} from 'lucide-react';

const Feed = () => {
  const feedPosts = [
    {
      id: 1,
      type: 'daily-problem',
      title: 'Daily Challenge: Binary Tree Maximum Path Sum',
      description: 'Solve this hard-level problem to earn 50 XP and climb the leaderboard!',
      difficulty: 'Hard',
      xp: 50,
      author: 'System',
      timeAgo: '2h ago',
      likes: 127,
      comments: 34,
      solved: 89,
      isSpecial: true
    },
    {
      id: 2,
      type: 'achievement',
      title: 'Congratulations! 🎉',
      description: 'CodeMaster_42 just reached Level 15 and unlocked the "Algorithm Wizard" badge!',
      author: 'CodeMaster_42',
      level: 15,
      badge: 'Algorithm Wizard',
      timeAgo: '5m ago',
      likes: 45,
      comments: 12
    },
    {
      id: 3,
      type: 'question',
      title: 'Need help with Dynamic Programming approach',
      description: 'I\'m struggling with the coin change problem. Can someone explain the optimal substructure?',
      author: 'NewbieCoder',
      level: 3,
      timeAgo: '1h ago',
      likes: 23,
      comments: 8,
      tags: ['Dynamic Programming', 'Help Needed']
    },
    {
      id: 4,
      type: 'tutorial',
      title: 'Master Binary Search in 10 Minutes',
      description: 'A comprehensive guide to understanding and implementing binary search with visual examples.',
      author: 'AlgoExpert_99',
      level: 25,
      timeAgo: '3h ago',
      likes: 156,
      comments: 42,
      readTime: '10 min read',
      tags: ['Tutorial', 'Binary Search']
    },
    {
      id: 5,
      type: 'quiz-announcement',
      title: 'Weekly DSA Quiz - Starting in 2 Hours!',
      description: 'Test your knowledge on Trees and Graphs. Winner gets 200 XP bonus!',
      author: 'Admin',
      timeAgo: '30m ago',
      participants: 234,
      prize: '200 XP',
      isLive: true
    }
  ];

  const renderPostIcon = (type: string) => {
    switch (type) {
      case 'daily-problem':
        return <Calendar className="w-5 h-5 text-orange-400" />;
      case 'achievement':
        return <Trophy className="w-5 h-5 text-amber-400" />;
      case 'question':
        return <MessageSquare className="w-5 h-5 text-blue-400" />;
      case 'tutorial':
        return <BookOpen className="w-5 h-5 text-purple-400" />;
      case 'quiz-announcement':
        return <Flag className="w-5 h-5 text-pink-400" />;
      default:
        return <Code className="w-5 h-5 text-green-400" />;
    }
  };

  const getLevelColor = (level: number) => {
    if (level >= 20) return 'text-purple-400 border-purple-400';
    if (level >= 10) return 'text-blue-400 border-blue-400';
    if (level >= 5) return 'text-green-400 border-green-400';
    return 'text-gray-400 border-gray-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 neon-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            ByteBattles Hub
          </h1>
          <p className="text-xl text-muted-foreground">Level up your coding skills in the ultimate DSA battleground</p>
        </div>

        {/* User Stats Bar */}
        <div className="glass-effect rounded-xl p-6 mb-8 neon-glow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-12 h-12 border-2 border-green-400">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" />
                <AvatarFallback>YU</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold text-lg">Your Progress</h3>
                <p className="text-sm text-muted-foreground">Keep coding to level up!</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="level-badge text-black font-bold px-3 py-1 rounded-full text-sm mb-1">
                  Level 8
                </div>
                <p className="text-xs text-muted-foreground">Current Level</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">1,250</div>
                <p className="text-xs text-muted-foreground">Total XP</p>
              </div>
              <div className="w-32">
                <div className="text-xs text-muted-foreground mb-1">Progress to Level 9</div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="xp-bar h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">750/1000 XP</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feed Content */}
      <div className="max-w-4xl mx-auto space-y-6">
        {feedPosts.map((post) => (
          <Card 
            key={post.id} 
            className={`glass-effect border-0 hover:scale-[1.02] transition-all duration-300 ${
              post.isSpecial ? 'pulse-glow' : 'hover:shadow-lg hover:shadow-green-500/20'
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-slate-800/50">
                    {renderPostIcon(post.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-bold text-lg">{post.title}</h3>
                      {post.isSpecial && (
                        <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white animate-pulse">
                          HOT
                        </Badge>
                      )}
                      {post.isLive && (
                        <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse">
                          LIVE
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      {post.author !== 'System' && post.author !== 'Admin' && (
                        <>
                          <User className="w-4 h-4" />
                          <span>{post.author}</span>
                          {post.level && (
                            <Badge variant="outline" className={`text-xs ${getLevelColor(post.level)}`}>
                              Lv.{post.level}
                            </Badge>
                          )}
                          <span>•</span>
                        </>
                      )}
                      <span>{post.timeAgo}</span>
                    </div>
                  </div>
                </div>
                {post.type === 'daily-problem' && post.difficulty && (
                  <Badge 
                    className={`
                      ${post.difficulty === 'Hard' ? 'bg-red-500/20 text-red-400 border-red-500' : ''}
                      ${post.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500' : ''}
                      ${post.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400 border-green-500' : ''}
                    `}
                  >
                    {post.difficulty}
                  </Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-muted-foreground mb-4">{post.description}</p>
              
              {/* Special content based on post type */}
              {post.type === 'daily-problem' && (
                <div className="flex items-center space-x-4 mb-4 p-3 bg-slate-800/30 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-400">+{post.xp}</div>
                    <div className="text-xs text-muted-foreground">XP Reward</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-400">{post.solved}</div>
                    <div className="text-xs text-muted-foreground">Solved</div>
                  </div>
                  <Button className="ml-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                    <Code className="w-4 h-4 mr-2" />
                    Solve Now
                  </Button>
                </div>
              )}

              {post.type === 'achievement' && post.badge && (
                <div className="flex items-center space-x-3 mb-4 p-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-lg border border-amber-500/20">
                  <Trophy className="w-8 h-8 text-amber-400 float-animation" />
                  <div>
                    <div className="font-bold text-amber-400">{post.badge}</div>
                    <div className="text-sm text-muted-foreground">Achievement Unlocked</div>
                  </div>
                </div>
              )}

              {post.type === 'quiz-announcement' && (
                <div className="flex items-center justify-between mb-4 p-3 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg border border-pink-500/20">
                  <div className="flex items-center space-x-3">
                    <Flag className="w-6 h-6 text-pink-400" />
                    <div>
                      <div className="font-bold text-pink-400">{post.participants} Participants</div>
                      <div className="text-sm text-muted-foreground">Prize: {post.prize}</div>
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                    Join Quiz
                  </Button>
                </div>
              )}

              {post.tags && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-slate-700/50 text-slate-300">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Interaction buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                <div className="flex items-center space-x-6">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-400 hover:bg-red-500/10">
                    <Heart className="w-4 h-4 mr-2" />
                    {post.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {post.comments}
                  </Button>
                  {post.type === 'tutorial' && post.readTime && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <BookOpen className="w-4 h-4 mr-1" />
                      {post.readTime}
                    </div>
                  )}
                </div>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-green-400">
                  <Star className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More Button */}
      <div className="max-w-4xl mx-auto mt-8 text-center">
        <Button 
          variant="outline" 
          className="glass-effect border-green-500/30 hover:bg-green-500/10 hover:border-green-500/50"
        >
          Load More Posts
        </Button>
      </div>
    </div>
  );
};

export default Feed;
