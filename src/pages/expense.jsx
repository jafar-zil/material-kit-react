import { Helmet } from 'react-helmet-async';

import { ExpenseView } from 'src/sections/expense/view';

// ----------------------------------------------------------------------

export default function ExpensePage() {
  return (
    <>
      <Helmet>
        <title> Expenses | Cashflow </title>
      </Helmet>

      <ExpenseView />
    </>
  );
}
