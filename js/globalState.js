import { get } from '/js/localStorage.js';

const components = [
  { id: 1, title: 'Counter', category: 'Interactive', description: 'Increment and decrement with reactive state.', stars: 42, icon: 'plus', animated: true },
  { id: 2, title: 'Todo List', category: 'Interactive', description: 'Add, complete, and remove items reactively.', stars: 87, icon: 'list', animated: true },
  { id: 3, title: 'Toggle Switch', category: 'Forms', description: 'Accessible toggle bound to reactive state.', stars: 31, icon: 'switch', animated: false },
  { id: 4, title: 'Card Grid', category: 'Layout', description: 'Responsive card grid using crow layout.', stars: 23, icon: 'grid', animated: false },
  { id: 5, title: 'Accordion', category: 'Interactive', description: 'Collapsible sections with smooth transitions.', stars: 56, icon: 'chevron-down', animated: true },
  { id: 6, title: 'Search Input', category: 'Forms', description: 'Live filtering with reactive input binding.', stars: 19, icon: 'search', animated: false },
  { id: 7, title: 'Navigation Tabs', category: 'Navigation', description: 'Tab-based navigation with active state tracking.', stars: 38, icon: 'menu', animated: false },
  { id: 8, title: 'Modal Dialog', category: 'Interactive', description: 'Accessible modal with backdrop and focus trap.', stars: 64, icon: 'frame', animated: true },
  { id: 9, title: 'Data Table', category: 'Layout', description: 'Sortable table with reactive column headers.', stars: 45, icon: 'table', animated: false },
  { id: 10, title: 'Color Picker', category: 'Forms', description: 'Palette selector with reactive state binding.', stars: 28, icon: 'color-swatch', animated: true },
  { id: 11, title: 'Breadcrumb', category: 'Navigation', description: 'Dynamic breadcrumb trail from reactive path state.', stars: 17, icon: 'chevron-right', animated: false },
  { id: 12, title: 'Notification Toast', category: 'Interactive', description: 'Auto-dismissing notifications via reactive queue.', stars: 71, icon: 'bell', animated: true },
];

const categories = ['All', 'Interactive', 'Forms', 'Layout', 'Navigation'];

const globalState = {
  user: null,
  userMenuOpen: false,
  authReady: !get('mkp-session'),
  wsConnected: false,
  darkMode: get('mkp-darkMode'),
  categories,
  components,
  filteredComponents: components,
  selectedCategory: 'All',
  searchQuery: '',
  applyFilter() {
    const { components, selectedCategory, searchQuery } = this;
    this.filteredComponents = components.filter(c =>
      (selectedCategory === 'All' || c.category === selectedCategory) &&
      (!searchQuery || c.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  },
};

export default globalState;
