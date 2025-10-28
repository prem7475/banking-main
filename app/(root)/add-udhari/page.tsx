'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Plus, Minus, Users, Calculator } from 'lucide-react'
import HeaderBox from '@/components/HeaderBox'

interface Friend {
  _id: string
  name: string
  email?: string
  phone?: string
}

interface SplitParticipant {
  friendId: string
  friendName: string
  amount: number
}

export default function AddUdhariPage() {
  const router = useRouter()
  const [friends, setFriends] = useState<Friend[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    description: '',
    totalAmount: '',
    whoPaid: '',
    category: 'General',
  })
  const [participants, setParticipants] = useState<SplitParticipant[]>([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadFriends()
  }, [])

  const loadFriends = async () => {
    try {
      const { getFriends } = await import('@/lib/actions/friend.actions')
      const friendsData = await getFriends()
      setFriends(friendsData)
    } catch (error) {
      console.error('Error loading friends:', error)
      setError('Failed to load friends')
    }
  }

  const addParticipant = (friend: Friend) => {
    if (participants.find(p => p.friendId === friend._id)) return

    setParticipants([...participants, {
      friendId: friend._id,
      friendName: friend.name,
      amount: 0,
    }])
  }

  const removeParticipant = (friendId: string) => {
    setParticipants(participants.filter(p => p.friendId !== friendId))
  }

  const updateParticipantAmount = (friendId: string, amount: number) => {
    setParticipants(participants.map(p =>
      p.friendId === friendId ? { ...p, amount } : p
    ))
  }

  const splitEqually = () => {
    const totalAmount = parseFloat(formData.totalAmount) || 0
    const numParticipants = participants.length
    if (numParticipants === 0 || totalAmount === 0) return

    const equalShare = totalAmount / numParticipants
    setParticipants(participants.map(p => ({
      ...p,
      amount: Math.round(equalShare * 100) / 100, // Round to 2 decimal places
    })))
  }

  const calculateTotalSplit = () => {
    return participants.reduce((sum, p) => sum + p.amount, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const totalAmount = parseFloat(formData.totalAmount)
    const totalSplit = calculateTotalSplit()

    if (!formData.description.trim()) {
      setError('Please enter a description')
      return
    }

    if (!totalAmount || totalAmount <= 0) {
      setError('Please enter a valid total amount')
      return
    }

    if (!formData.whoPaid) {
      setError('Please select who paid')
      return
    }

    if (participants.length === 0) {
      setError('Please add at least one participant')
      return
    }

    if (Math.abs(totalSplit - totalAmount) > 0.01) {
      setError('The split amounts must equal the total amount')
      return
    }

    setIsLoading(true)

    try {
      const { createUdhariDebt } = await import('@/lib/actions/udhari.actions')
      await createUdhariDebt({
        description: formData.description,
        totalAmount,
        whoPaid: formData.whoPaid,
        splitWith: participants,
        category: formData.category,
        date: new Date(),
      })

      setSuccess('Udhari debt created successfully!')
      setTimeout(() => {
        router.push('/udhari')
      }, 1500)
    } catch (error) {
      console.error('Error creating udhari debt:', error)
      setError('Failed to create udhari debt')
    } finally {
      setIsLoading(false)
    }
  }

  const availableFriends = friends.filter(friend =>
    !participants.find(p => p.friendId === friend._id)
  )

  const totalSplit = calculateTotalSplit()
  const totalAmount = parseFloat(formData.totalAmount) || 0
  const splitDifference = totalAmount - totalSplit

  return (
    <section className="add-udhari">
      <div className="add-udhari-content">
        <HeaderBox
          type="title"
          title="Add Udhari"
          subtext="Split bills and track who owes what"
        />

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bill Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="e.g., Dinner at Restaurant, Movie tickets, etc."
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalAmount">Total Amount *</Label>
                    <Input
                      id="totalAmount"
                      type="number"
                      value={formData.totalAmount}
                      onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="whoPaid">Who Paid? *</Label>
                    <Select value={formData.whoPaid} onValueChange={(value) => setFormData({ ...formData, whoPaid: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select who paid" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="me">I paid</SelectItem>
                        {friends.map((friend) => (
                          <SelectItem key={friend._id} value={friend.name}>
                            {friend.name} paid
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General">General</SelectItem>
                        <SelectItem value="Food">Food</SelectItem>
                        <SelectItem value="Transport">Transport</SelectItem>
                        <SelectItem value="Entertainment">Entertainment</SelectItem>
                        <SelectItem value="Shopping">Shopping</SelectItem>
                        <SelectItem value="Utilities">Utilities</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Split With ({participants.length} people)
                  </span>
                  {participants.length > 1 && (
                    <Button type="button" variant="outline" size="sm" onClick={splitEqually}>
                      <Calculator className="w-4 h-4 mr-2" />
                      Split Equally
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {participants.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No participants added yet</p>
                ) : (
                  <div className="space-y-3">
                    {participants.map((participant) => (
                      <div key={participant.friendId} className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{participant.friendName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">₹</span>
                          <Input
                            type="number"
                            value={participant.amount}
                            onChange={(e) => updateParticipantAmount(participant.friendId, parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            className="w-24"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeParticipant(participant.friendId)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {availableFriends.length > 0 && (
                  <div className="mt-4">
                    <Label className="text-sm font-medium">Add Participants:</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {availableFriends.map((friend) => (
                        <Button
                          key={friend._id}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addParticipant(friend)}
                          className="flex items-center gap-2"
                        >
                          <Plus className="w-3 h-3" />
                          {friend.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {participants.length > 0 && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total Split:</span>
                      <span className={`font-bold ${Math.abs(splitDifference) < 0.01 ? 'text-green-600' : 'text-red-600'}`}>
                        ₹{totalSplit.toFixed(2)}
                      </span>
                    </div>
                    {Math.abs(splitDifference) >= 0.01 && (
                      <p className="text-sm text-red-600 mt-1">
                        Difference: ₹{splitDifference.toFixed(2)}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <AlertDescription className="text-green-600">{success}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Udhari'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
