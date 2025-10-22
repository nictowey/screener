export interface PriceVolumeBar {
  date: string | Date;
  open?: number;
  high?: number;
  low?: number;
  close: number;
  volume: number;
}

export interface FloatDataset {
  floatShares: number;
  outstandingShares?: number;
  shortInterestPercent?: number;
  institutionalOwnershipPercent?: number;
}

export interface CatalystEvent {
  id?: string;
  date: string | Date;
  type: string;
  description?: string;
  impact?: 'low' | 'medium' | 'high';
  source?: string;
}

export interface BreakoutProvider {
  getPriceVolumeHistory: (symbol: string) => Promise<PriceVolumeBar[]>;
  getFloatData: (symbol: string) => Promise<FloatDataset>;
  getCatalystEvents: (symbol: string) => Promise<CatalystEvent[]>;
}

const notConfigured = (method: keyof BreakoutProvider) =>
  async (symbol: string): Promise<never> => {
    throw new Error(
      `Provider method \"${String(method)}\" is not configured for symbol ${symbol}. ` +
        'Provide an implementation via the providers option when calling the breakout service.'
    );
  };

export const providers: BreakoutProvider = {
  getPriceVolumeHistory: notConfigured('getPriceVolumeHistory'),
  getFloatData: notConfigured('getFloatData'),
  getCatalystEvents: notConfigured('getCatalystEvents'),
};

export default providers;
