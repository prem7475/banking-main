'use server';

// MOCK ACTION: Returns a fake user
export const getLoggedInUser = async () => {
  return {
    $id: 'user_12345',
    email: 'guest@manor.com',
    userId: 'user_12345',
    dwollaCustomerUrl: 'dummy_url',
    dwollaCustomerId: 'dummy_id',
    firstName: 'Prem',
    lastName: 'Narayani',
    name: 'Prem Narayani',
    address1: 'VESIT, Mumbai',
    city: 'Mumbai',
    state: 'MH',
    postalCode: '400074',
    dateOfBirth: '2003-01-01',
    ssn: '1234',
  };
};

export const signIn = async ({ email, password }: any) => {
  // Always returns success for demo
  return { ...await getLoggedInUser(), email };
};

export const signUp = async (userData: any) => {
  return { ...await getLoggedInUser(), ...userData };
};

export const getUser = async (userId: string) => {
  return getLoggedInUser();
};

export const logoutAccount = async () => {
  return true;
};

export const createBankAccount = async (props: any) => {
  return { success: true };
}