import { Helmet } from 'react-helmet-async';

import { ItemView } from 'src/sections/item/view';

// ----------------------------------------------------------------------

export default function ItemPage() {
  return (
    <>
      <Helmet>
        <title> Items | Cashflow </title>
      </Helmet>

      <ItemView />
    </>
  );
}
