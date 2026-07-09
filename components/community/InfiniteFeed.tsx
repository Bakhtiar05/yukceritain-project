'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { fetchFeedBatch } from '@/lib/actions/community'
import StoryCard from './StoryCard'
import { Loader2 } from 'lucide-react'

interface InfiniteFeedProps {
  initialPosts: any[]
  mode: 'for-you' | 'explore'
  session: any
  searchQuery?: string
}

export default function InfiniteFeed({ initialPosts, mode, session, searchQuery = '' }: InfiniteFeedProps) {
  const [posts, setPosts] = useState<any[]>(initialPosts)
  const [hasMore, setHasMore] = useState(initialPosts.length >= 5)
  const [loading, setLoading] = useState(false)
  
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadingNodeRef = useRef<HTMLDivElement | null>(null)
  const [currentQuery, setCurrentQuery] = useState(searchQuery)

  // Reset feed when search query changes
  useEffect(() => {
    if (searchQuery !== currentQuery) {
      setPosts([])
      setHasMore(true)
      setCurrentQuery(searchQuery)
    }
  }, [searchQuery, currentQuery])

  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)

    try {
      const nextPosts = await fetchFeedBatch(posts.length, 5, mode, currentQuery)
      if (nextPosts && nextPosts.length > 0) {
        setPosts((prev) => {
          // Filter out duplicates based on id
          const newPosts = nextPosts.filter((np: any) => !prev.some(p => p.id === np.id))
          return [...prev, ...newPosts]
        })
      }
      
      if (!nextPosts || nextPosts.length < 5) {
        setHasMore(false)
      }
    } catch (err: any) {
      if (err?.message?.includes('Failed to fetch') || err?.message?.includes('fetch failed')) {
        // Ignore fetch errors caused by navigation aborts
        return
      }
      console.error('Error fetching more posts:', err)
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, posts.length, mode, currentQuery])

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect()

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        loadMorePosts()
      }
    }, {
      rootMargin: '100px', // trigger load a bit before reaching the bottom
    })

    if (loadingNodeRef.current) {
      observerRef.current.observe(loadingNodeRef.current)
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect()
    }
  }, [loadMorePosts, hasMore, loading])

  const isAuthenticated = !!session

  return (
    <>
      {posts.map((post, index) => {
        const isLikedByMe = session ? post.likes.some((like: any) => like.profile_id === session.user.id) : false
        const commentsCount = post.comments[0]?.count || 0

        return (
          <StoryCard
            key={post.id}
            id={post.id}
            content={post.content}
            is_anonymous={post.is_anonymous}
            created_at={post.created_at}
            profile={post.profile as any}
            likes_count={post.likes.length}
            comments_count={commentsCount}
            is_liked_by_me={isLikedByMe}
            isAuthenticated={isAuthenticated}
            isOwner={session?.user?.id === post.profile_id}
            index={index}
          />
        )
      })}

      {hasMore && (
        <div ref={loadingNodeRef} className="py-8 flex justify-center items-center w-full">
          <div className="flex flex-col items-center text-muted-foreground gap-3">
             <Loader2 className="w-6 h-6 animate-spin text-primary" />
             <span className="text-[13px] font-medium animate-pulse">Loading more stories...</span>
          </div>
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="py-10 text-center flex flex-col items-center">
          <span className="text-3xl mb-2">🎉</span>
          <p className="text-[14px] font-bold text-foreground">You are all caught up!</p>
          <p className="text-[13px] text-muted-foreground mt-1">Check back later for more stories.</p>
        </div>
      )}
    </>
  )
}
