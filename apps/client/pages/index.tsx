import { PatchSize, useGetLaunchesQuery } from '@space-explorer/graphql/react';
import React from 'react';
import { Layout } from '../components/layout';

export function Index() {
  const { data, loading } = useGetLaunchesQuery({
    variables: {
      size: PatchSize.Large,
    },
  });
  console.log(data);
  return (
    <Layout title="Home Page">
      <div>Index</div>
    </Layout>
  );
}

export default Index;
