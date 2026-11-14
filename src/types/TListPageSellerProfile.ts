
export type TListPageSellerProfile={
    sellers:TSellers[],
 pageSize:number,
page:number,
totalPages:number,
accumulatedItems:number
totalElements:number

}
export type TSellers={
  userId:number
  sellerId:number,
  status: string;
  identityVerified: boolean;
  verifiedAt: string | null;

  totalSales: number;
  totalSettlement: number;

  fullLegalName: string | null;
  dateOfBirth: string | null; // LocalDate: YYYY-MM-DD

  // DAC7 calendar-year counters
  currentYearSalesCount: number;
  currentYearGrossVolumePln: number;
  isDac7Reportable: boolean;
  dac7FlaggedAt: string | null;

  // Stripe Connect
  stripeAccountId: string | null;
  stripeOnboardingComplete: boolean;
  stripeChargesEnabled: boolean;
  stripePayoutsEnabled: boolean;
  stripeTransfersEnabled: boolean;
  stripeTransfersStatus: string | null;

  stripeCurrentlyDue: string | null;
  stripeEventuallyDue: string | null;
  stripePastDue: string | null;
  stripeVerificationErrors: string | null;
  stripeDisabledReason: string | null;
  stripeAccountUpdatedAt: string | null;

  numberOfCancelledOrders: number | null;
}