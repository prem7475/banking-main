'use server'

import { connectDB } from '@/lib/mongodb'
import Friend from '@/lib/models/Friend'
import { getLoggedInUser } from './user.actions'

export async function createFriend(friendData: {
  name: string
  email?: string
  phone?: string
  avatar?: string
}) {
  try {
    await connectDB()
    const user = await getLoggedInUser()
    if (!user) throw new Error('User not authenticated')

    const friend = await Friend.create({
      userId: user.userId,
      ...friendData,
    })

    return friend
  } catch (error) {
    console.error('Error creating friend:', error)
    throw error
  }
}

export async function getFriends() {
  try {
    await connectDB()
    const user = await getLoggedInUser()
    if (!user) throw new Error('User not authenticated')

    const friends = await Friend.find({ userId: user.userId }).sort({ createdAt: -1 })
    return friends
  } catch (error) {
    console.error('Error fetching friends:', error)
    throw error
  }
}

export async function updateFriend(friendId: string, updateData: Partial<{
  name: string
  email: string
  phone: string
  avatar: string
}>) {
  try {
    await connectDB()
    const user = await getLoggedInUser()
    if (!user) throw new Error('User not authenticated')

    const friend = await Friend.findOneAndUpdate(
      { _id: friendId, userId: user.userId },
      updateData,
      { new: true }
    )

    if (!friend) throw new Error('Friend not found')
    return friend
  } catch (error) {
    console.error('Error updating friend:', error)
    throw error
  }
}

export async function deleteFriend(friendId: string) {
  try {
    await connectDB()
    const user = await getLoggedInUser()
    if (!user) throw new Error('User not authenticated')

    const friend = await Friend.findOneAndDelete({
      _id: friendId,
      userId: user.userId,
    })

    if (!friend) throw new Error('Friend not found')
    return friend
  } catch (error) {
    console.error('Error deleting friend:', error)
    throw error
  }
}
