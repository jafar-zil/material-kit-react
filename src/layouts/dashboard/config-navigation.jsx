import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'item',
    path: '/item',
    icon: icon('ic_item'),
  },
  {
    title: 'income',
    path: '/income',
    icon: icon('ic_income'),
  },
  {
    title: 'expense',
    path: '/expense',
    icon: icon('ic_expense'),
  },
  {
    title: 'logout',
    icon: icon('ic_logout'),
    action: async () => {
    },
  },
];

export default navConfig;
