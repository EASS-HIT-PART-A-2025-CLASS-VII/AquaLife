import React from 'react';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../contexts/ThemeContext';

interface AIEvaluationResultProps {
  evaluationResult: string;
}

interface ParsedSections {
  tankVolume: string[];
  bioload: string[];
  fishCompatibility: string[];
  schoolingRequirements: string[];
  recommendations: string[];
  overallRating: string;
}

const SECTION_PATTERNS = {
  tankVolume: /^🔵\s*Tank Volume/i,
  bioload: /^🟡\s*Bioload/i,
  fishCompatibility: /^🟣\s*Fish Compatibility/i,
  schoolingRequirements: /^🟢\s*Schooling/i,
  recommendations: /^✅\s*Recommendations/i,
  overallRating: /^⭐\s*Overall Rating/i,
} as const;

const SKIP_LINES = [
  'AI Aquarium Evaluation',
  'Additional Information',
  '## Aquarium Analysis:',
  'Important Note:',
  '⚠️Important Notice'
];

export const AIEvaluationResult: React.FC<AIEvaluationResultProps> = ({ evaluationResult }) => {
  const { isDarkMode } = useTheme();

  const cleanResponse = (response: string): string[] => {
    return response
      .replace(/\*/g, '') // Remove all asterisks
      .replace(/\n\s*\n/g, '\n') // Remove multiple newlines
      .trim()
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);
  };

  const shouldSkipLine = (line: string): boolean => {
    return SKIP_LINES.some(skipPattern => line.includes(skipPattern));
  };

  const extractSectionContent = (line: string): string => {
    // Remove various section header patterns
    return line
      .replace(/^\d*[\.\)]\s*/i, '') // Remove "1. " or "1) " or just "1"
      .replace(/^[🔵🟡🟣🟢✅⭐]\s*/i, '') // Remove emoji prefixes
      .replace(/^(Tank Volume|Bioload|Fish Compatibility|Schooling Requirements|Recommendations|Overall Rating)[:\s]*/i, '')
      .replace(/Analysis$|Assessment$|Requirements$|Summary$/i, '') // Remove common suffixes
      .trim();
  };

  const getSectionType = (line: string): keyof ParsedSections | null => {
    // Handle specific numbered emoji format (e.g., "1🔵 Tank Volume Analysis")
    if (/^\d*🔵.*Tank Volume/i.test(line)) return 'tankVolume';
    if (/^\d*🟡.*Bioload/i.test(line)) return 'bioload';
    if (/^\d*🟣.*Fish Compatibility/i.test(line)) return 'fishCompatibility';
    if (/^\d*🟢.*Schooling/i.test(line)) return 'schoolingRequirements';
    if (/^\d*✅.*Recommendations/i.test(line)) return 'recommendations';
    if (/^\d*⭐.*Overall Rating/i.test(line)) return 'overallRating';
    
    // Check for numbered sections without emojis
    if (/^\d+[\.\)]\s*(Bioload|Bioload.*Capacity)/i.test(line)) return 'bioload';
    if (/^\d+[\.\)]\s*(Fish Compatibility|Compatibility.*Behavior)/i.test(line)) return 'fishCompatibility';
    
    // Then check standard patterns
    for (const [sectionType, pattern] of Object.entries(SECTION_PATTERNS)) {
      if (pattern.test(line)) {
        return sectionType as keyof ParsedSections;
      }
    }
    return null;
  };

  const addContentToSection = (
    sections: ParsedSections,
    currentSection: keyof ParsedSections | 'general',
    content: string
  ): void => {
    if (currentSection === 'general' || !content.trim()) return;
    
    if (currentSection === 'overallRating' && !sections.overallRating) {
      sections.overallRating = content;
    } else if (currentSection !== 'overallRating') {
      sections[currentSection].push(content);
    }
  };

  const isLikelySectionHeader = (line: string): boolean => {
    // Check if line looks like a section header
    return /^\d+[\.\)]\s*[A-Z]/i.test(line) || // "1. Something" or "2) Something"
           /^[🔵🟡🟣🟢✅⭐]/i.test(line) || // Starts with emoji
           /^(Tank Volume|Bioload|Fish Compatibility|Schooling|Recommendations|Overall Rating)/i.test(line);
  };

  const parseAIResponse = (response: string): ParsedSections => {
    const sections: ParsedSections = {
      tankVolume: [],
      bioload: [],
      fishCompatibility: [],
      schoolingRequirements: [],
      recommendations: [],
      overallRating: '',
    };

    // Log the raw response for debugging
    console.log('Raw AI Response:', response);

    const lines = response.split('\n').map(line => line.trim()).filter(Boolean);
    let currentSection: keyof ParsedSections | null = null;
    let currentContent: string[] = [];

    for (const line of lines) {
      // Check if this is a section header
      const sectionType = getSectionType(line);
      
      if (sectionType) {
        // If we were processing a previous section, save its content
        if (currentSection && currentContent.length > 0) {
          if (currentSection === 'overallRating') {
            sections.overallRating = currentContent.join(' ');
          } else {
            sections[currentSection] = currentContent;
          }
        }
        
        // Start new section
        currentSection = sectionType;
        currentContent = [];
        
        // Extract content from the header line if any
        const headerContent = line.split(/^[🔵🟡🟣🟢✅⭐]\s*/i)[1]?.split(':')[1]?.trim();
        if (headerContent) {
          currentContent.push(headerContent);
        }
      } else if (currentSection && !shouldSkipLine(line)) {
        // Add content to current section
        currentContent.push(line);
      }
    }

    // Don't forget to save the last section
    if (currentSection && currentContent.length > 0) {
      if (currentSection === 'overallRating') {
        sections.overallRating = currentContent.join(' ');
      } else {
        sections[currentSection] = currentContent;
      }
    }

    console.log('Parsed sections:', sections);
    return sections;
  };

  // Helper method to redistribute content that might be in wrong sections
  const redistributeOrphanedContent = (sections: ParsedSections): void => {
    // If tankVolume is empty but we have content that mentions volume/gallons
    if (sections.tankVolume.length === 0) {
      const volumeContent = sections.bioload.filter(item => /gallons|volume|capacity/i.test(item));
      if (volumeContent.length > 0) {
        sections.tankVolume.push(...volumeContent);
        sections.bioload = sections.bioload.filter(item => !volumeContent.includes(item));
      }
    }

    // Move compatibility content from other sections
    const compatibilityKeywords = /aggressive|peaceful|territorial|compatible|behavior|harass/i;
    Object.keys(sections).forEach(key => {
      if (key !== 'fishCompatibility' && key !== 'overallRating') {
        const sectionKey = key as keyof ParsedSections;
        if (Array.isArray(sections[sectionKey])) {
          const compatContent = (sections[sectionKey] as string[]).filter(item => 
            compatibilityKeywords.test(item)
          );
          if (compatContent.length > 0 && sections.fishCompatibility.length === 0) {
            sections.fishCompatibility.push(...compatContent);
            sections[sectionKey] = (sections[sectionKey] as string[]).filter(item => 
              !compatContent.includes(item)
            ) as any;
          }
        }
      }
    });
  };

  const renderSectionContent = (items: string[], sectionId: string) => {
    return items.map((item, index) => (
      <p key={`${sectionId}-${index}`} className="leading-relaxed">
        {item}
      </p>
    ));
  };

  const renderBulletContent = (items: string[], sectionId: string, bulletIcon: string, bulletColor: string) => {
    return items.map((item, index) => {
      // Check if this is a header/category line (ends with colon and is short)
      const isHeader = item.endsWith(':') && item.length < 50;
      
      return (
        <div key={`${sectionId}-${index}`} className="flex items-start">
          <span className={`mr-2 font-bold ${bulletColor}`}>{bulletIcon}</span>
          <p className={`leading-relaxed ${isHeader ? 'font-semibold text-base' : ''}`}>
            {item}
          </p>
        </div>
      );
    });
  };

  const getRatingColors = (ratingNum: number) => {
    if (ratingNum >= 8) {
      return {
        bg: isDarkMode ? 'bg-green-900/40 border-green-400' : 'bg-green-100 border-green-300',
        text: isDarkMode ? 'text-green-200' : 'text-green-900'
      };
    }
    if (ratingNum >= 6) {
      return {
        bg: isDarkMode ? 'bg-yellow-900/40 border-yellow-400' : 'bg-yellow-100 border-yellow-300',
        text: isDarkMode ? 'text-yellow-200' : 'text-yellow-900'
      };
    }
    if (ratingNum >= 4) {
      return {
        bg: isDarkMode ? 'bg-orange-900/40 border-orange-400' : 'bg-orange-100 border-orange-300',
        text: isDarkMode ? 'text-orange-200' : 'text-orange-900'
      };
    }
    return {
      bg: isDarkMode ? 'bg-red-900/40 border-red-400' : 'bg-red-100 border-red-300',
      text: isDarkMode ? 'text-red-200' : 'text-red-900'
    };
  };

  const renderOverallRating = (overallRating: string) => {
    const ratingPattern = /(\d+)\/10/;
    const match = ratingPattern.exec(overallRating);
    const ratingNum = match ? parseInt(match[1]) : null;
    
    if (ratingNum !== null) {
      const colors = getRatingColors(ratingNum);

      return (
        <div className={`p-4 rounded-lg border ${colors.bg} ${colors.text}`}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <span className="text-xl font-bold">{ratingNum}/10</span>
          </div>
          <p className="mt-2">{overallRating.replace(/\d+\/10/, '').trim()}</p>
        </div>
      );
    }
    
    // If no rating number found, still show content but without special rating styling
    return (
      <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}>
        <p className={`leading-relaxed font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          {overallRating}
        </p>
      </div>
    );
  };

  const formatAIResponse = (response: string) => {
    const sections = parseAIResponse(response);
    redistributeOrphanedContent(sections);

    return (
      <div className="space-y-6">
        {/* Tank Volume Analysis Section */}
        {sections.tankVolume.length > 0 && (
          <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-blue-400' : 'bg-blue-50 border-blue-200'}`}>
            <h4 className={`font-bold text-lg mb-3 flex items-center ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                1
              </span>
              🔵 Tank Volume Analysis
            </h4>
            <div className={`space-y-2 ${isDarkMode ? 'text-gray-200' : 'text-blue-800'}`}>
              {renderSectionContent(sections.tankVolume, 'tank-volume')}
            </div>
          </div>
        )}

        {/* Bioload Assessment Section */}
        <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-amber-400' : 'bg-amber-50 border-amber-200'}`}>
          <h4 className={`font-bold text-lg mb-3 flex items-center ${isDarkMode ? 'text-amber-300' : 'text-amber-900'}`}>
            <span className="bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
              2
            </span>
            🟡 Bioload Assessment
          </h4>
          <div className={`space-y-2 ${isDarkMode ? 'text-gray-200' : 'text-amber-800'}`}>
            {sections.bioload.length > 0 ? (
              renderSectionContent(sections.bioload, 'bioload')
            ) : (
              <p className={`italic ${isDarkMode ? 'text-gray-400' : 'text-amber-600'}`}>
                For a {sections.tankVolume.length > 0 && sections.tankVolume[0].includes('gallons') ? 
                  sections.tankVolume[0].match(/(\d+,?\d*)\s*gallons/)?.[1] + ' gallon' : 'large'} tank, 
                ensure adequate filtration and regular water changes to maintain water quality with this fish load.
              </p>
            )}
          </div>
        </div>
        
        {/* Fish Compatibility Section */}
        {sections.fishCompatibility.length > 0 && (
          <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-purple-400' : 'bg-purple-50 border-purple-200'}`}>
            <h4 className={`font-bold text-lg mb-3 flex items-center ${isDarkMode ? 'text-purple-300' : 'text-purple-900'}`}>
              <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                3
              </span>
              🟣 Fish Compatibility Analysis
            </h4>
            <div className={`space-y-2 ${isDarkMode ? 'text-gray-200' : 'text-purple-800'}`}>
              {renderBulletContent(
                sections.fishCompatibility, 
                'fish-compatibility', 
                '•', 
                isDarkMode ? 'text-purple-400' : 'text-purple-600'
              )}
            </div>
          </div>
        )}

        {/* Schooling Requirements Section */}
        <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-cyan-400' : 'bg-indigo-50 border-indigo-200'}`}>
          <h4 className={`font-bold text-lg mb-3 flex items-center ${isDarkMode ? 'text-cyan-300' : 'text-indigo-900'}`}>
            <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
              4
            </span>
            🟢 Schooling Requirements
          </h4>
          <div className={`space-y-2 ${isDarkMode ? 'text-gray-200' : 'text-indigo-800'}`}>
            {sections.schoolingRequirements.length > 0 ? (
              renderBulletContent(
                sections.schoolingRequirements, 
                'schooling-requirements', 
                '•', 
                isDarkMode ? 'text-cyan-400' : 'text-indigo-600'
              )
            ) : (
              <p className={`italic ${isDarkMode ? 'text-gray-400' : 'text-indigo-600'}`}>
                Most of the selected fish are not schooling species and can be kept individually or in pairs. 
                Ensure adequate space for territorial fish to establish their own areas.
              </p>
            )}
          </div>
        </div>
        
        {/* Recommendations Section */}
        {sections.recommendations.length > 0 && (
          <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-emerald-400' : 'bg-green-50 border-green-200'}`}>
            <h4 className={`font-bold text-lg mb-3 flex items-center ${isDarkMode ? 'text-emerald-300' : 'text-green-900'}`}>
              <span className="bg-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                5
              </span>
              ✅ Expert Recommendations
            </h4>
            <div className={`space-y-2 ${isDarkMode ? 'text-gray-200' : 'text-green-800'}`}>
              {renderBulletContent(
                sections.recommendations, 
                'recommendations', 
                '✓', 
                isDarkMode ? 'text-emerald-400' : 'text-green-600'
              )}
            </div>
          </div>
        )}

        {/* Overall Rating Section */}
        <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-gradient-to-r from-slate-50 to-gray-50 border-gray-300'}`}>
          <h4 className={`font-bold text-lg mb-3 flex items-center ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            <span className="bg-gray-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
              6
            </span>
            ⭐ Overall Rating & Summary
          </h4>
          <div className="space-y-2">
            {sections.overallRating && sections.overallRating.trim() && sections.overallRating !== 'Notes:' ? (
              renderOverallRating(sections.overallRating)
            ) : (
              <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}>
                <p className={`italic ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  This aquarium setup shows both potential and challenges. With careful management of bioload, 
                  territorial behavior, and water quality, it can become a thriving marine ecosystem. 
                  Consider the recommendations above for the best results.
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Important Notice */}
        <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-orange-400' : 'bg-red-50 border-red-200'}`}>
          <h4 className={`font-bold mb-2 flex items-center ${isDarkMode ? 'text-orange-300' : 'text-red-900'}`}>
            <span className="mr-2">⚠️</span>
            Important Notice
          </h4>
          <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-200' : 'text-red-800'}`}>
            Always research fish compatibility before adding them to your aquarium. Consider their adult size, temperament, and specific water requirements. Overcrowding and improper compatibility can lead to stress, disease, and even death.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className={`mt-6 p-6 rounded-lg border ${isDarkMode ? 'bg-gradient-to-r from-gray-800 to-gray-700 border-blue-400' : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200'}`}>
      <h4 className={`font-extrabold text-2xl mb-6 flex items-center ${isDarkMode ? 'text-white drop-shadow-lg' : 'text-blue-900'}`}>
        <SparklesIcon className="h-7 w-7 mr-3" />
        AI Aquarium Evaluation
      </h4>
      {formatAIResponse(evaluationResult)}
    </div>
  );
}; 