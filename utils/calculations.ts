// 스테이킹 수익률 계산
export const calculateStakingYield = (amount: number): number => {
  const baseStakingRate = 0.125; // 12.5%
  return amount * baseStakingRate;
};

// 리스테이킹 보너스 계산 (F point)
export const calculateRestakingBonus = (amount: number): number => {
  const fPointMultiplier = 4;
  const baseRestakingRate = 0.02; // 2% base rate for F points
  return amount * baseRestakingRate * fPointMultiplier;
};

// Rate-X LP 수익 계산
export const calculateRateXYield = (amount: number): number => {
  const baseLPRate = 0.086; // 8.6%
  const ratePointMultiplier = 4;
  const ratePointYield = 0.01; // 1% base rate for Rate points
  return amount * (baseLPRate + (ratePointYield * ratePointMultiplier));
};

// 숏 포지션 수익 계산 (Drift Protocol)
export const calculateShortYield = (amount: number): number => {
  const fundingFeeRate = 0.086; // 8.6%
  return amount * fundingFeeRate;
};

// 총 연간 수익률 계산
export const calculateTotalAnnualYield = (amount: number): {
  totalYield: number;
  dailyYield: number;
  annualYield: number;
  components: {
    stakingYield: number;
    restakingBonus: number;
    rateXYield: number;
    shortYield: number;
  };
} => {
  const stakingYield = calculateStakingYield(amount);
  const restakingBonus = calculateRestakingBonus(amount);
  const rateXYield = calculateRateXYield(amount);
  const shortYield = calculateShortYield(amount);

  const totalYieldRate = 0.327; // 32.7%
  const totalYield = amount * totalYieldRate;
  const dailyYield = totalYield / 365;

  return {
    totalYield,
    dailyYield,
    annualYield: totalYield,
    components: {
      stakingYield,
      restakingBonus,
      rateXYield,
      shortYield
    }
  };
}; 