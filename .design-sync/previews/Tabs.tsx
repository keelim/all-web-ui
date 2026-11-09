import { Tabs, TabsContent, TabsList, TabsTrigger } from '@keelim/all-web-ui';

export const Default = () => (
  <Tabs defaultValue="overview" style={{ maxWidth: 420 }}>
    <TabsList aria-label="Portfolio sections">
      <TabsTrigger value="overview">Overview</TabsTrigger>
      <TabsTrigger value="holdings">Holdings</TabsTrigger>
      <TabsTrigger value="activity">Activity</TabsTrigger>
    </TabsList>
    <TabsContent value="overview">
      <p className="type-body">Total value is up 12.4% this quarter across 18 holdings.</p>
    </TabsContent>
    <TabsContent value="holdings">
      <p className="type-body">18 holdings across 4 accounts.</p>
    </TabsContent>
    <TabsContent value="activity">
      <p className="type-body">No trades in the last 7 days.</p>
    </TabsContent>
  </Tabs>
);

export const SecondTabSelected = () => (
  <Tabs defaultValue="holdings" style={{ maxWidth: 420 }}>
    <TabsList aria-label="Portfolio sections">
      <TabsTrigger value="overview">Overview</TabsTrigger>
      <TabsTrigger value="holdings">Holdings</TabsTrigger>
      <TabsTrigger value="activity">Activity</TabsTrigger>
    </TabsList>
    <TabsContent value="overview">
      <p className="type-body">Total value is up 12.4% this quarter.</p>
    </TabsContent>
    <TabsContent value="holdings">
      <p className="type-body">18 holdings across 4 accounts. Largest position: VTI (22%).</p>
    </TabsContent>
    <TabsContent value="activity">
      <p className="type-body">No trades in the last 7 days.</p>
    </TabsContent>
  </Tabs>
);
