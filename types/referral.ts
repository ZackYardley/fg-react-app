// Structure to hold top referrers
interface TopReferrer {
  name: string;
  userId: string;
  totalReferrals: number;
}

// Document to store aggregated referral data
interface ReferralLeaderboard {
  topReferrers: TopReferrer[];
  lastUpdated: Date;
}

export { TopReferrer, ReferralLeaderboard };
