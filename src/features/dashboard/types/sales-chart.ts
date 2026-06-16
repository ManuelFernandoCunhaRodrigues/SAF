export interface TooltipPayload {
  dataKey: string;
  value: number;
  color: string;
}

export interface TooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}
