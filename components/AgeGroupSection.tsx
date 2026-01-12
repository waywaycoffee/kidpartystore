/**
 * Age Group Section Component
 */

'use client';

import Link from 'next/link';

interface AgeGroup {
  id: string;
  label: string;
  labelEn: string;
  ageRange: string;
  icon: string;
}

const ageGroups: AgeGroup[] = [
  {
    id: '1',
    label: 'Age 1',
    labelEn: 'Age 1',
    ageRange: '1 year',
    icon: '👶',
  },
  {
    id: '3-5',
    label: 'Ages 3-5',
    labelEn: 'Ages 3-5',
    ageRange: '3-5 years',
    icon: '🧒',
  },
  {
    id: '6-9',
    label: 'Ages 6-9',
    labelEn: 'Ages 6-9',
    ageRange: '6-9 years',
    icon: '👦',
  },
  {
    id: '10+',
    label: 'Ages 10+',
    labelEn: 'Ages 10+',
    ageRange: '10+ years',
    icon: '🧑',
  },
];

export default function AgeGroupSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8">Shop by Age Group</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ageGroups.map((group) => (
            <Link
              key={group.id}
              href={`/themes?ageGroup=${group.id}`}
              className="group relative bg-gradient-to-br from-primary-50 to-accent-50 rounded-lg p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary-300"
            >
              <div className="text-center">
                <div className="text-5xl mb-4">{group.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {group.labelEn}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{group.ageRange}</p>
                <span className="text-primary-600 font-semibold group-hover:text-primary-700">
                  View Themes →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

