import { FilterChip, InfoChip, CTAButton, SearchFilter } from './types';

export const heroData = {
  backgroundImage: '/Hero.png',
  badge: 'TOP PROJECT IN AHM',
  title: 'The Skyline\nResidences',
  infoChips: [
    {
      icon: 'location',
      text: 'Shantigram',
    },
    {
      icon: 'price',
      text: '£1.2M - £4.5M',
    },
    {
      icon: 'bedroom',
      text: '1-4 Bedroom Apartments',
    },
  ] as InfoChip[],
  ctaButtons: [
    {
      text: 'View Project',
      variant: 'primary',
      href: '#',
    },
    {
      text: 'Request Info',
      variant: 'secondary',
      href: '#',
    },
  ] as CTAButton[],
  searchFilters: [
    {
      id: 'location',
      label: 'Location',
      placeholder: 'Search by location',
      icon: 'search',
      type: 'text',
    },
    {
      id: 'property-type',
      label: 'Property Type',
      placeholder: 'Select property type',
      icon: 'dropdown',
      type: 'select',
      options: ['Apartment', 'Villa', 'Penthouse', 'Townhouse'],
    },
    {
      id: 'price-range',
      label: 'Price Range',
      placeholder: 'Select price range',
      icon: 'dropdown',
      type: 'select',
      options: ['£0 - £500,000', '£500,000 - £1,000,000', '£1,000,000+'],
    },
  ] as SearchFilter[],
  filterChips: [
    { id: 'more-filters', label: 'More Filters', active: false },
    { id: 'studio', label: 'Studio - 5+ BHK', active: false },
    { id: 'price-asc', label: 'Price: Low to High', active: false },
    { id: 'ready-to-move', label: 'Ready to Move', active: false },
    { id: 'rera-approved', label: 'RERA Approved', active: false },
    { id: 'new-launch', label: 'New Launch', active: true },
    { id: 'furnished', label: 'Furnished', active: false },
    { id: 'semi-furnished', label: 'Semi-Furnished', active: false },
    { id: 'unfurnished', label: 'Unfurnished', active: false },
  ] as FilterChip[],
};
