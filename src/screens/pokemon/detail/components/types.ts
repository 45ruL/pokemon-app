export interface KeyMove {
  name?: string;
  type?: string;
}
export interface KeyMoveCardProps {
  move: KeyMove;
}

export interface StatBarProps {
  label: string;
  value: number;
  maxValue?: number;
  color: string;
}
