/**
 * Theme Filter Component
 */

'use client';

interface ThemeFilterProps {
  selectedGender: 'boy' | 'girl' | 'neutral' | null;
  selectedAgeGroup: string | null;
  onGenderChange: (gender: 'boy' | 'girl' | 'neutral' | null) => void;
  onAgeGroupChange: (ageGroup: string | null) => void;
}

export default function ThemeFilter({
  selectedGender,
  selectedAgeGroup,
  onGenderChange,
  onAgeGroupChange,
}: ThemeFilterProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {/* Gender Filter */}
      <div className="flex gap-2">
        <span className="text-sm font-medium text-gray-700 self-center">Gender:</span>
        <button
          onClick={() => onGenderChange(null)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedGender === null
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All
        </button>
        <button
          onClick={() => onGenderChange('boy')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedGender === 'boy'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Boy
        </button>
        <button
          onClick={() => onGenderChange('girl')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedGender === 'girl'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Girl
        </button>
        <button
          onClick={() => onGenderChange('neutral')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedGender === 'neutral'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Neutral
        </button>
      </div>

      {/* Age Group Filter */}
      <div className="flex gap-2">
        <span className="text-sm font-medium text-gray-700 self-center">Age:</span>
        <button
          onClick={() => onAgeGroupChange(null)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedAgeGroup === null
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All
        </button>
        <button
          onClick={() => onAgeGroupChange('1')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedAgeGroup === '1'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          1 Year
        </button>
        <button
          onClick={() => onAgeGroupChange('3-5')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedAgeGroup === '3-5'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          3-5 Years
        </button>
        <button
          onClick={() => onAgeGroupChange('6-9')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedAgeGroup === '6-9'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          6-9 Years
        </button>
        <button
          onClick={() => onAgeGroupChange('10+')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedAgeGroup === '10+'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          10+
        </button>
      </div>
    </div>
  );
}

