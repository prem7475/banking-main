'use server';

export const getBudgets = async (userId: string) => {
  return [
    { _id: 'b1', name: 'Manor Operations', totalAmount: 10000, spentAmount: 4500, color: '#FF5733' },
    { _id: 'b2', name: 'Travel', totalAmount: 5000, spentAmount: 1200, color: '#33FF57' },
  ];
};

export const createBudget = async (budget: any) => {
  console.log("Mock create budget:", budget);
  return { success: true };
};

export const updateBudget = async (id: string, amount: number) => {
  return { success: true };
};