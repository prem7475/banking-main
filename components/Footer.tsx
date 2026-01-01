import Image from 'next/image'
import React from 'react'

const Footer = ({ user, type = 'desktop' }: FooterProps) => {
  const handleLogOut = () => {
    // Clear localStorage
    localStorage.removeItem('banking_bankAccounts')
    localStorage.removeItem('banking_creditCards')
    localStorage.removeItem('banking_transactions')
    localStorage.removeItem('banking_userProfile')
    
    // Reload page
    window.location.href = '/'
  }

  // Get first letter of name for avatar
  const nameInitial = user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'
  
  // Extract email from user object if available
  const userEmail = user?.email || 'user@banking.app'

  return (
    <footer className="footer">
      <div className={type === 'mobile' ? 'footer_name-mobile' : 'footer_name'}>
        <p className="text-xl font-bold text-gray-700">
          {nameInitial}
        </p>
      </div>

      <div className={type === 'mobile' ? 'footer_email-mobile' : 'footer_email'}>
          <h1 className="text-14 truncate text-gray-700 font-semibold">
            {user?.fullName || 'User'}
          </h1>
          <p className="text-14 truncate font-normal text-gray-600">
            {userEmail}
          </p>
      </div>

      <div className="footer_image" onClick={handleLogOut}>
        <Image src="icons/logout.svg" fill alt="logout" />
      </div>
    </footer>
  )
}

export default Footer