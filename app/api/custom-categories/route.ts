import { NextRequest, NextResponse } from 'next/server'
import { getCustomCategories, createCustomCategory, updateCustomCategory, deleteCustomCategory } from '@/lib/actions/customCategory.actions'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') as 'expense' | 'income' | undefined

    const categories = await getCustomCategories(type)
    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Error fetching custom categories:', error)
    return NextResponse.json({ error: 'Failed to fetch custom categories' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, type, icon, color } = body

    if (!name || !type) {
      return NextResponse.json({ error: 'Name and type are required' }, { status: 400 })
    }

    if (!['expense', 'income'].includes(type)) {
      return NextResponse.json({ error: 'Type must be either expense or income' }, { status: 400 })
    }

    const category = await createCustomCategory({
      name,
      type,
      icon,
      color,
    })

    return NextResponse.json({ category }, { status: 201 })
  } catch (error) {
    console.error('Error creating custom category:', error)
    return NextResponse.json({ error: 'Failed to create custom category' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, icon, color } = body

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 })
    }

    const category = await updateCustomCategory(id, {
      name,
      icon,
      color,
    })

    return NextResponse.json({ category })
  } catch (error) {
    console.error('Error updating custom category:', error)
    return NextResponse.json({ error: 'Failed to update custom category' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 })
    }

    const category = await deleteCustomCategory(id)
    return NextResponse.json({ category })
  } catch (error) {
    console.error('Error deleting custom category:', error)
    return NextResponse.json({ error: 'Failed to delete custom category' }, { status: 500 })
  }
}
