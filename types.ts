
export enum ChartType {
  BAR = 'Bar',
  LINE = 'Line',
  PIE = 'Pie',
}

export interface DataKey {
  dataKey: string;
  color: string;
}

export interface ChartData {
  name: string;
  [key: string]: any;
}

export interface PieChartData {
  name: string;
  value: number;
  fill: string;
}

export interface GeminiResponse {
  data: any[];
  keys?: DataKey[];
}
