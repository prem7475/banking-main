'use server';

export const getUdharis = async (userId: string) => {
  return [
    {
      _id: 't1',
      type: 'Gave',
      amount: 500,
      description: 'Lunch Bill',
      status: 'Pending',
      createdAt: new Date().toISOString(),
      receiverId: { name: 'Amit Sharma' }
    },
    {
      _id: 't2',
      type: 'Got',
      amount: 2000,
      description: 'Manor Gift Hamper',
      status: 'Paid',
      createdAt: new Date().toISOString(),
      senderId: { name: 'Riya Gupta' }
    }
  ];
};

export const createUdhari = async (transaction: any) => {
  console.log("Mock create udhari:", transaction);
  return { success: true };
};

export const settleUdhari = async (id: string) => {
  return { success: true };
};