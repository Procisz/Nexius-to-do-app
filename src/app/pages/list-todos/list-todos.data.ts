import { FILTER_VALUES } from '../../utils/constants/form.constants';

export type Filter = {
    value: (typeof FILTER_VALUES)[keyof typeof FILTER_VALUES];
    label: string;
};

export const filterValues: Filter[] = [
    { value: FILTER_VALUES.All, label: 'Összes' },
    { value: FILTER_VALUES.Completed, label: 'Csak kész' },
    { value: FILTER_VALUES.Incomplete, label: 'Csak nem kész' },
];
