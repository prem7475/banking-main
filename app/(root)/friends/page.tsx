'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Plus, User, Phone, Mail, Trash2, Edit } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import HeaderBox from '@/components/HeaderBox'

interface Friend {
  _id: string
  name: string
  email?: string
  phone?: string
  avatar?: string
}

export default function FriendsPage() {
  const [friends, setFriends] = useState<Friend[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingFriend, setEditingFriend] = useState<Friend | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  })
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
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      if (editingFriend) {
        // Update friend
        const { updateFriend } = await import('@/lib/actions/friend.actions')
        await updateFriend(editingFriend._id, formData)
        setSuccess('Friend updated successfully!')
      } else {
        // Add new friend
        const { createFriend } = await import('@/lib/actions/friend.actions')
        await createFriend(formData)
        setSuccess('Friend added successfully!')
      }

      setFormData({ name: '', email: '', phone: '' })
      setShowAddDialog(false)
      setEditingFriend(null)
      loadFriends()
    } catch (error) {
      console.error('Error saving friend:', error)
      setError('Failed to save friend')
    }
  }

  const handleEdit = (friend: Friend) => {
    setEditingFriend(friend)
    setFormData({
      name: friend.name,
      email: friend.email || '',
      phone: friend.phone || '',
    })
    setShowAddDialog(true)
  }

  const handleDelete = async (friendId: string) => {
    if (!confirm('Are you sure you want to delete this friend?')) return

    try {
      const { deleteFriend } = await import('@/lib/actions/friend.actions')
      await deleteFriend(friendId)
      setSuccess('Friend deleted successfully!')
      loadFriends()
    } catch (error) {
      console.error('Error deleting friend:', error)
      setError('Failed to delete friend')
    }
  }

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '' })
    setEditingFriend(null)
    setError('')
    setSuccess('')
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <section className="friends">
      <div className="friends-content">
        <header className="friends-header">
          <HeaderBox
            type="title"
            title="Friends"
            subtext="Manage your friends list for split bills and Udhari"
          />

          <Dialog open={showAddDialog} onOpenChange={(open) => {
            setShowAddDialog(open)
            if (!open) resetForm()
          }}>
            <DialogTrigger asChild>
              <Button className="friends-add-btn">
                <Plus className="w-4 h-4 mr-2" />
                Add Friend
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingFriend ? 'Edit Friend' : 'Add New Friend'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="col-span-3"
                    placeholder="Friend's name"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="col-span-3"
                    placeholder="friend@example.com"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="col-span-3"
                    placeholder="+91 9876543210"
                  />
                </div>

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

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingFriend ? 'Update' : 'Add'} Friend
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </header>

        <div className="friends-grid">
          {friends.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No friends added yet</h3>
              <p className="text-gray-500 mb-6">Add friends to start splitting bills and managing Udhari</p>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Friend
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {friends.map((friend) => (
                <Card key={friend._id} className="friend-card">
                  <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage src={friend.avatar} alt={friend.name} />
                      <AvatarFallback>
                        {friend.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{friend.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {friend.email && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="w-4 h-4 mr-2" />
                          {friend.email}
                        </div>
                      )}
                      {friend.phone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-4 h-4 mr-2" />
                          {friend.phone}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(friend)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(friend._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
