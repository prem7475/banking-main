'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { formatAmount, formatDateTime } from "@/lib/utils"

interface TransactionDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  transaction: any
  accounts: Account[]
}

const TransactionDetailsModal = ({ isOpen, onClose, transaction, accounts }: TransactionDetailsModalProps) => {
  if (!transaction) return null

  const senderBank = accounts.find(acc => acc.id === transaction.senderBankId)
  const receiverBank = accounts.find(acc => acc.id === transaction.receiverBankId)

  const amount = formatAmount(Math.abs(transaction.amount))
  const dateTime = formatDateTime(new Date(transaction.date))

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Transaction ID */}
          <div>
            <label className="text-sm font-medium text-gray-500">Transaction ID</label>
            <p className="text-sm font-mono bg-gray-50 p-2 rounded break-all">{transaction.id || transaction._id || transaction.$id}</p>
          </div>

          {/* Amount */}
          <div>
            <label className="text-sm font-medium text-gray-500">Amount</label>
            <p className={`text-2xl font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {transaction.amount > 0 ? '+' : '-'}₹{amount}
            </p>
          </div>

          {/* From Bank */}
          <div>
            <label className="text-sm font-medium text-gray-500">From Bank</label>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{senderBank?.officialName || senderBank?.name || 'Unknown Bank'}</Badge>
              <span className="text-sm text-gray-600">({senderBank?.mask || '****'})</span>
            </div>
          </div>

          {/* To Bank */}
          <div>
            <label className="text-sm font-medium text-gray-500">To Bank</label>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{receiverBank?.officialName || receiverBank?.name || 'Unknown Bank'}</Badge>
              <span className="text-sm text-gray-600">({receiverBank?.mask || '****'})</span>
            </div>
          </div>

          {/* Receiver Name */}
          <div>
            <label className="text-sm font-medium text-gray-500">Receiver Name</label>
            <p className="text-sm">{transaction.name || 'Unknown Receiver'}</p>
          </div>

          {/* Date & Time */}
          <div>
            <label className="text-sm font-medium text-gray-500">Date & Time</label>
            <p className="text-sm">{dateTime.dateTime}</p>
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium text-gray-500">Category</label>
            <Badge variant="secondary">{transaction.category || 'Transfer'}</Badge>
          </div>

          {/* Channel */}
          <div>
            <label className="text-sm font-medium text-gray-500">Channel</label>
            <Badge variant="outline">{transaction.channel || transaction.paymentChannel || 'Online'}</Badge>
          </div>

          {/* Transaction Type */}
          <div>
            <label className="text-sm font-medium text-gray-500">Transaction Type</label>
            <Badge variant={transaction.type === 'credit' ? 'default' : 'destructive'}>
              {transaction.type === 'credit' ? 'Credit' : 'Debit'}
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TransactionDetailsModal
