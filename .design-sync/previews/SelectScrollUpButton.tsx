import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@keelim/all-web-ui';

const symbols = ['AAPL', 'AMZN', 'BND', 'GOOGL', 'MSFT', 'NVDA', 'TSLA', 'VTI', 'VXUS'];

export const InOpenList = () => (
  <div style={{ width: 240 }}>
    <Select defaultOpen defaultValue="VTI">
      <SelectTrigger aria-label="Symbol">
        <SelectValue placeholder="Choose a symbol" />
      </SelectTrigger>
      <SelectContent>
        {symbols.map((s) => (
          <SelectItem key={s} value={s}>{s}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);
