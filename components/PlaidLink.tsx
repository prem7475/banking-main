import React from 'react'
import { Button } from './ui/button'
import Image from 'next/image';

const PlaidLink = ({ variant }: PlaidLinkProps) => {
  return (
    <>
      {variant === 'primary' ? (
        <Button className="plaidlink-primary" disabled>
          Connect bank
        </Button>
      ): variant === 'ghost' ? (
        <Button variant="ghost" className="plaidlink-ghost" disabled>
          <Image 
            src="/icons/connect-bank.svg"
            alt="connect bank"
            width={24}
            height={24}
          />
          <p className='hidden text-[16px] font-semibold text-black-2 xl:block'>Connect bank</p>
        </Button>
      ): (
        <Button className="plaidlink-default" disabled>
          <Image 
            src="/icons/connect-bank.svg"
            alt="connect bank"
            width={24}
            height={24}
          />
          <p className='text-[16px] font-semibold text-black-2'>Connect bank</p>
        </Button>
      )}
    </>
  )
}

export default PlaidLink