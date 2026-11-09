import {
  Badge,
  DataNumber,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@keelim/all-web-ui';

const holdings = [
  { symbol: 'VTI', name: 'Total Stock Market ETF', weight: '22.0%', value: '$54,628', status: 'On target' },
  { symbol: 'BND', name: 'Total Bond Market ETF', weight: '18.5%', value: '$45,937', status: 'On target' },
  { symbol: 'VXUS', name: 'Total International ETF', weight: '15.2%', value: '$37,743', status: 'Overweight' },
  { symbol: 'AAPL', name: 'Apple Inc.', weight: '6.1%', value: '$15,147', status: 'Underweight' },
];

export const Holdings = () => (
  <Table>
    <TableCaption>Holdings as of market close.</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead>Symbol</TableHead>
        <TableHead>Name</TableHead>
        <TableHead style={{ textAlign: 'right' }}>Weight</TableHead>
        <TableHead style={{ textAlign: 'right' }}>Value</TableHead>
        <TableHead>Status</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {holdings.map((h) => (
        <TableRow key={h.symbol}>
          <TableCell className="type-label">{h.symbol}</TableCell>
          <TableCell>{h.name}</TableCell>
          <TableCell style={{ textAlign: 'right' }}><DataNumber>{h.weight}</DataNumber></TableCell>
          <TableCell style={{ textAlign: 'right' }}><DataNumber>{h.value}</DataNumber></TableCell>
          <TableCell>
            <Badge tone={h.status === 'On target' ? 'success' : 'warning'}>{h.status}</Badge>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
    <TableFooter>
      <TableRow>
        <TableCell colSpan={3}>Total</TableCell>
        <TableCell style={{ textAlign: 'right' }}><DataNumber>$153,455</DataNumber></TableCell>
        <TableCell />
      </TableRow>
    </TableFooter>
  </Table>
);
