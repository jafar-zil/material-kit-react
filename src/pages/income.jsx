import { Helmet } from 'react-helmet-async';

import { IncomeView } from 'src/sections/income/view';

// ----------------------------------------------------------------------

export default function IncomePage() {
  return (
    <>
      <Helmet>
        <title> Incomes | Cashflow </title>
      </Helmet>

      <IncomeView />
    </>
  );
}
