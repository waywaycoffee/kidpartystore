/**
 * Theme Header Component
 */

'use client';

interface ThemeHeaderProps {
  name: string;
  nameEn: string;
  description?: string;
  descriptionEn?: string;
  bannerImage?: string;
  ageRange: { min: number; max: number };
  gender: 'boy' | 'girl' | 'neutral';
  recommendedGuests?: number;
  recommendedVenue?: string;
}

export default function ThemeHeader({
  name,
  nameEn,
  description,
  descriptionEn,
  bannerImage,
  ageRange,
  gender,
  recommendedGuests,
  recommendedVenue,
}: ThemeHeaderProps) {
  const genderLabels = {
    boy: 'Boy',
    girl: 'Girl',
    neutral: 'Neutral',
  };

  return (
    <div className="relative mb-8">
      {bannerImage ? (
        <div className="aspect-[21/9] bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg overflow-hidden">
          {/* Image placeholder */}
        </div>
      ) : (
        <div className="aspect-[21/9] bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">{nameEn}</h1>
        </div>
      )}

      <div className="mt-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{nameEn}</h1>
        {(descriptionEn || description) && (
          <p className="text-lg text-gray-600 mb-4">
            {descriptionEn || description}
          </p>
        )}

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Age Range:</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {ageRange.min}-{ageRange.max} Years
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Gender:</span>
            <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm">
              {genderLabels[gender]}
            </span>
          </div>
          {recommendedGuests && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Recommended Guests:</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {recommendedGuests} People
              </span>
            </div>
          )}
          {recommendedVenue && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Recommended Venue:</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                {recommendedVenue === 'indoor' ? 'Indoor' : 'Outdoor'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

