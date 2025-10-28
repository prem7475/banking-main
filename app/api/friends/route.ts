import { NextRequest, NextResponse } from 'next/server'
import { getFriends, createFriend, updateFriend, deleteFriend } from '@/lib/actions/friend.actions'

export async function GET() {
  try {
    const friends = await getFriends()
    return NextResponse.json({ friends })
  } catch (error) {
    console.error('Error fetching friends:', error)
    return NextResponse.json({ error: 'Failed to fetch friends' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone } = body

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const friend = await createFriend({ name, email, phone })
    return NextResponse.json({ friend }, { status: 201 })
  } catch (error) {
    console.error('Error creating friend:', error)
    return NextResponse.json({ error: 'Failed to create friend' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, email, phone } = body

    if (!id) {
      return NextResponse.json({ error: 'Friend ID is required' }, { status: 400 })
    }

    const friend = await updateFriend(id, { name, email, phone })
    return NextResponse.json({ friend })
  } catch (error) {
    console.error('Error updating friend:', error)
    return NextResponse.json({ error: 'Failed to update friend' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Friend ID is required' }, { status: 400 })
    }

    const friend = await deleteFriend(id)
    return NextResponse.json({ friend })
  } catch (error) {
    console.error('Error deleting friend:', error)
    return NextResponse.json({ error: 'Failed to delete friend' }, { status: 500 })
  }
}
