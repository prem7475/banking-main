'use server'

import connectDB from '@/lib/mongodb'
import CustomCategory from '@/lib/models/CustomCategory'
import { getLoggedInUser } from './user.actions'

export async function createCustomCategory(categoryData: {
  name: string
  type: 'expense' | 'income'
  icon?: string
  color?: string
}): Promise<any> {
  try {
    await connectDB()
    const user = await getLoggedInUser()
    if (!user) throw new Error('User not authenticated')

    const category = await CustomCategory.create({
      userId: user.userId,
      ...categoryData,
      icon: categoryData.icon || 'tag',
      color: categoryData.color || '#3B82F6',
      isActive: true,
    })

    return category
  } catch (error) {
    console.error('Error creating custom category:', error)
    throw error
  }
}

export async function getCustomCategories(type?: 'expense' | 'income'): Promise<any[]> {
  try {
    await connectDB()
    const user = await getLoggedInUser()
    if (!user) throw new Error('User not authenticated')

    const query = { userId: user.userId, isActive: true }
    if (type) {
      query.type = type
    }

    const categories = await CustomCategory.find(query).sort({ createdAt: -1 })
    return categories
  } catch (error) {
    console.error('Error fetching custom categories:', error)
    throw error
  }
}

export async function updateCustomCategory(categoryId: string, updateData: Partial<{
  name: string
  icon: string
  color: string
  isActive: boolean
}>): Promise<any> {
  try {
    await connectDB()
    const user = await getLoggedInUser()
    if (!user) throw new Error('User not authenticated')

    const category = await CustomCategory.findOneAndUpdate(
      { _id: categoryId, userId: user.userId },
      updateData,
      { new: true }
    )

    if (!category) throw new Error('Category not found')
    return category
  } catch (error) {
    console.error('Error updating custom category:', error)
    throw error
  }
}

export async function deleteCustomCategory(categoryId: string): Promise<any> {
  try {
    await connectDB()
    const user = await getLoggedInUser()
    if (!user) throw new Error('User not authenticated')

    const category = await CustomCategory.findOneAndUpdate(
      { _id: categoryId, userId: user.userId },
      { isActive: false },
      { new: true }
    )

    if (!category) throw new Error('Category not found')
    return category
  } catch (error) {
    console.error('Error deleting custom category:', error)
    throw error
  }
}
