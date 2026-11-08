import { Badge, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@keelim/all-web-ui';

export const Default = () => (
  <Card style={{ maxWidth: 360 }}>
    <CardHeader>
      <CardTitle>Monthly rebalance</CardTitle>
      <CardDescription>Target allocation drifted 4.2% since the last run.</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="type-body">3 positions are above their target weight. Review before the market opens.</p>
    </CardContent>
    <CardFooter style={{ gap: 'var(--kui-space-2)' }}>
      <Button>Review plan</Button>
      <Button variant="ghost">Dismiss</Button>
    </CardFooter>
  </Card>
);

export const WithStatus = () => (
  <Card style={{ maxWidth: 360 }}>
    <CardHeader>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--kui-space-2)' }}>
        <CardTitle>Data sync</CardTitle>
        <Badge tone="success">Healthy</Badge>
      </div>
      <CardDescription>Last synced 2 minutes ago from 4 linked accounts.</CardDescription>
    </CardHeader>
  </Card>
);
