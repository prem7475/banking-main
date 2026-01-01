'use server';

export const getFriends = async (userId: string) => {
  // Hardcoded list of friends
  return [
    { _id: '1', name: 'Amit Sharma', email: 'amit@example.com', phoneNumber: '9876543210' },
    { _id: '2', name: 'Riya Gupta', email: 'riya@example.com', phoneNumber: '9123456789' },
    { _id: '3', name: 'Manor Client', email: 'client@manor.com', phoneNumber: '9988776655' },
  ];
};

export const addFriend = async ({ name, email, phoneNumber }: any) => {
  // Simulates adding a friend
  console.log("Mock add friend:", name);
  return { _id: Math.random().toString(), name, email, phoneNumber };
};

export const deleteFriend = async (friendId: string) => {
  return true;
};