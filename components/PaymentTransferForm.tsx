"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { createTransfer } from "@/lib/actions/dwolla.actions";
import { createTransaction } from "@/lib/actions/transaction.actions";
import { getBank, getBankByAccountId, getLoggedInUser, getUserUpiPin } from "@/lib/actions/user.actions";
import { decryptId } from "@/lib/utils";

import { BankDropdown } from "./BankDropdown";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertCircle } from "lucide-react";

const transferTypes = [
  { value: "upi", label: "UPI Transfer", description: "Instant transfer using UPI ID" },
  { value: "imps", label: "IMPS Transfer", description: "Immediate Payment Service (24x7)" },
  { value: "neft", label: "NEFT Transfer", description: "National Electronic Funds Transfer" },
  { value: "rtgs", label: "RTGS Transfer", description: "Real Time Gross Settlement (₹2 lakh+)" },
  { value: "tec", label: "TEC Transfer", description: "Telegraphic Transfer/Electronic Clearing" },
];

const formSchema = z.object({
  transferType: z.string().min(1, "Please select a transfer type"),
  // UPI fields
  upiId: z.string().optional(),
  // Bank transfer fields
  accountNumber: z.string().optional(),
  ifscCode: z.string().optional(),
  beneficiaryName: z.string().optional(),
  bankName: z.string().optional(),
  branchName: z.string().optional(),
  // Common fields
  amount: z.string().min(1, "Amount is required"),
  remarks: z.string().optional(),
  senderBank: z.string().min(1, "Please select a source bank account"),
}).superRefine((data, ctx) => {
  if (data.transferType === "upi") {
    if (!data.upiId || !data.upiId.includes("@")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Valid UPI ID is required (e.g., user@bankname)",
        path: ["upiId"],
      });
    }
  } else if (["imps", "neft", "rtgs", "tec"].includes(data.transferType)) {
    if (!data.accountNumber || data.accountNumber.length < 9) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Valid account number is required",
        path: ["accountNumber"],
      });
    }
    if (!data.ifscCode || data.ifscCode.length !== 11) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Valid IFSC code is required (11 characters)",
        path: ["ifscCode"],
      });
    }
    if (!data.beneficiaryName || data.beneficiaryName.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Beneficiary name is required",
        path: ["beneficiaryName"],
      });
    }
  }

  if (data.transferType === "rtgs") {
    const amount = parseFloat(data.amount);
    if (amount < 200000) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "RTGS minimum amount is ₹2,00,000",
        path: ["amount"],
      });
    }
  }

  if (data.transferType === "tec") {
    if (!data.bankName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Bank name is required for TEC transfer",
        path: ["bankName"],
      });
    }
    if (!data.branchName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Branch name is required for TEC transfer",
        path: ["branchName"],
      });
    }
  }
});

const PaymentTransferForm = ({ accounts }: PaymentTransferFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTransferType, setSelectedTransferType] = useState("");
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [upiPin, setUpiPin] = useState('');
  const [pinError, setPinError] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transferType: "",
      upiId: "",
      accountNumber: "",
      ifscCode: "",
      beneficiaryName: "",
      bankName: "",
      branchName: "",
      amount: "",
      remarks: "",
      senderBank: "",
    },
  });

  const submit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      // Get logged in user
      const user = await getLoggedInUser();
      if (!user) {
        setPinError('Please log in to make a transfer.');
        return;
      }

      // Show PIN dialog for verification
      setShowPinDialog(true);
      setIsLoading(false);
      return;
    } catch (error) {
      console.error("Transfer failed: ", error);
      setIsLoading(false);
    }
  };

  const handlePinSubmit = async () => {
    try {
      const user = await getLoggedInUser();
      if (!user) {
        setPinError('Please log in to make a transfer.');
        return;
      }

      const storedPin = await getUserUpiPin(user.userId);
      if (upiPin !== storedPin) {
        setPinError('Incorrect UPI PIN. Please try again.');
        return;
      }

      // PIN verified, proceed with transfer
      const data = form.getValues();
      const senderBank = accounts.find(acc => acc.appwriteItemId === data.senderBank);

      // Create transaction with proper bank linking
      const transaction = {
        name: data.transferType === "upi" ? `UPI Transfer to ${data.upiId}` :
             `Bank Transfer to ${data.beneficiaryName || data.accountNumber}`,
        amount: `-${data.amount}`, // Negative for debit
        senderId: user.userId,
        senderBankId: senderBank?.id || "demo-bank-1",
        receiverId: data.transferType === "upi" ? (data.upiId || "unknown") : (data.accountNumber || "unknown"),
        receiverBankId: data.transferType === "upi" ? "external-bank" : "mock-bank",
        email: data.transferType === "upi" ? (data.upiId || "unknown@upi") : `${data.accountNumber || "unknown"}@${data.ifscCode || "unknown"}`,
        userId: user.userId,
        bankId: senderBank?.id || "demo-bank-1",
      };

      const newTransaction = await createTransaction(transaction);

      if (newTransaction) {
        form.reset();
        setShowPinDialog(false);
        setUpiPin('');
        setPinError('');
        router.push("/");
      }
    } catch (error) {
      console.error("Transfer failed: ", error);
      setPinError('Transfer failed. Please try again.');
    }
  };

  const selectedType = transferTypes.find(type => type.value === selectedTransferType);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="flex flex-col">
        {/* Transfer Type Selection */}
        <FormField
          control={form.control}
          name="transferType"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content">
                  <FormLabel className="form-label">
                    Transfer Type
                  </FormLabel>
                  <FormDescription className="text-12 font-normal text-gray-600">
                    Select the type of fund transfer you want to make
                  </FormDescription>
                </div>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedTransferType(value);
                      }}
                      value={field.value}
                    >
                      <SelectTrigger className="form-input">
                        <SelectValue placeholder="Select transfer type" />
                      </SelectTrigger>
                      <SelectContent>
                        {transferTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div>
                              <div className="font-medium">{type.label}</div>
                              <div className="text-xs text-gray-500">{type.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        {/* Source Bank Selection */}
        <FormField
          control={form.control}
          name="senderBank"
          render={() => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content">
                  <FormLabel className="form-label">
                    Select Source Bank
                  </FormLabel>
                  <FormDescription className="text-12 font-normal text-gray-600">
                    Select the bank account you want to transfer funds from
                  </FormDescription>
                </div>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <BankDropdown
                      accounts={accounts}
                      setValue={form.setValue}
                      otherStyles="!w-full"
                    />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        {/* Conditional Fields Based on Transfer Type */}
        {selectedTransferType && (
          <div className="border-t border-gray-200">
            <div className="payment-transfer_form-details">
              <h2 className="text-18 font-semibold text-gray-900">
                {selectedType?.label} Details
              </h2>
              <p className="text-16 font-normal text-gray-600">
                Enter the required details for {selectedType?.label.toLowerCase()}
              </p>
            </div>

            {/* UPI Fields */}
            {selectedTransferType === "upi" && (
              <FormField
                control={form.control}
                name="upiId"
                render={({ field }) => (
                  <FormItem className="border-t border-gray-200">
                    <div className="payment-transfer_form-item py-5">
                      <FormLabel className="form-label">
                        UPI ID
                      </FormLabel>
                      <div className="flex w-full flex-col">
                        <FormControl>
                          <Input
                            placeholder="e.g., user@paytm, user@oksbi"
                            className="form-input"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-12 text-red-500" />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            )}

            {/* Bank Transfer Fields */}
            {["imps", "neft", "rtgs", "tec"].includes(selectedTransferType) && (
              <>
                <FormField
                  control={form.control}
                  name="accountNumber"
                  render={({ field }) => (
                    <FormItem className="border-t border-gray-200">
                      <div className="payment-transfer_form-item py-5">
                        <FormLabel className="form-label">
                          Beneficiary Account Number
                        </FormLabel>
                        <div className="flex w-full flex-col">
                          <FormControl>
                            <Input
                              placeholder="Enter account number"
                              className="form-input"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-12 text-red-500" />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ifscCode"
                  render={({ field }) => (
                    <FormItem className="border-t border-gray-200">
                      <div className="payment-transfer_form-item py-5">
                        <FormLabel className="form-label">
                          IFSC Code
                        </FormLabel>
                        <div className="flex w-full flex-col">
                          <FormControl>
                            <Input
                              placeholder="e.g., SBIN0001234"
                              className="form-input"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-12 text-red-500" />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="beneficiaryName"
                  render={({ field }) => (
                    <FormItem className="border-t border-gray-200">
                      <div className="payment-transfer_form-item py-5">
                        <FormLabel className="form-label">
                          Beneficiary Name
                        </FormLabel>
                        <div className="flex w-full flex-col">
                          <FormControl>
                            <Input
                              placeholder="Enter beneficiary name"
                              className="form-input"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-12 text-red-500" />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />

                {/* TEC Specific Fields */}
                {selectedTransferType === "tec" && (
                  <>
                    <FormField
                      control={form.control}
                      name="bankName"
                      render={({ field }) => (
                        <FormItem className="border-t border-gray-200">
                          <div className="payment-transfer_form-item py-5">
                            <FormLabel className="form-label">
                              Beneficiary Bank Name
                            </FormLabel>
                            <div className="flex w-full flex-col">
                              <FormControl>
                                <Input
                                  placeholder="e.g., State Bank of India"
                                  className="form-input"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-12 text-red-500" />
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="branchName"
                      render={({ field }) => (
                        <FormItem className="border-t border-gray-200">
                          <div className="payment-transfer_form-item py-5">
                            <FormLabel className="form-label">
                              Beneficiary Branch Name
                            </FormLabel>
                            <div className="flex w-full flex-col">
                              <FormControl>
                                <Input
                                  placeholder="Enter branch name"
                                  className="form-input"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-12 text-red-500" />
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </>
            )}

            {/* Amount Field */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="border-t border-gray-200">
                  <div className="payment-transfer_form-item py-5">
                    <FormLabel className="form-label">
                      Amount (₹)
                    </FormLabel>
                    <div className="flex w-full flex-col">
                      <FormControl>
                        <Input
                          placeholder={`e.g., ${selectedTransferType === "rtgs" ? "200000.00" : "1000.00"}`}
                          className="form-input"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-12 text-red-500" />
                      {selectedTransferType === "rtgs" && (
                        <p className="text-xs text-gray-500 mt-1">Minimum ₹2,00,000 for RTGS</p>
                      )}
                    </div>
                  </div>
                </FormItem>
              )}
            />

            {/* Remarks Field */}
            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem className="border-t border-gray-200">
                  <div className="payment-transfer_form-item pb-5 pt-6">
                    <div className="payment-transfer_form-content">
                      <FormLabel className="form-label">
                        Remarks (Optional)
                      </FormLabel>
                      <FormDescription className="text-12 font-normal text-gray-600">
                        Add any additional notes or reference for this transfer
                      </FormDescription>
                    </div>
                    <div className="flex w-full flex-col">
                      <FormControl>
                        <Textarea
                          placeholder="Enter remarks here"
                          className="form-input"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-12 text-red-500" />
                    </div>
                  </div>
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="payment-transfer_btn-box">
          <Button type="submit" className="payment-transfer_btn" disabled={!selectedTransferType}>
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" /> &nbsp; Processing...
              </>
            ) : (
              `Transfer via ${selectedType?.label || "Selected Method"}`
            )}
          </Button>
        </div>
      </form>

      {/* UPI PIN Dialog */}
      <Dialog open={showPinDialog} onOpenChange={setShowPinDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enter UPI PIN</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="upi-pin" className="text-right">
                UPI PIN
              </Label>
              <Input
                id="upi-pin"
                type="password"
                value={upiPin}
                onChange={(e) => setUpiPin(e.target.value)}
                className="col-span-3"
                placeholder="Enter 4-digit PIN"
                maxLength={4}
              />
            </div>
            {pinError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{pinError}</AlertDescription>
              </Alert>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowPinDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handlePinSubmit}>Submit</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Form>
  );
};

export default PaymentTransferForm;
