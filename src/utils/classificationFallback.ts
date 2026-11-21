import { ComplaintCategory, PriorityLevel, Department, AIAnalysisResult } from '../types/complaint';

const CATEGORY_DEPARTMENT_MAP: Record<ComplaintCategory, Department> = {
  'Road & Potholes': 'Public Works Department',
  'Waste Management': 'Sanitation Department',
  'Streetlight Problems': 'Electrical Department',
  'Water Supply & Leakage': 'Water Supply Department',
  'Drainage & Sewage': 'Drainage and Sewerage Department',
  'Public Safety': 'Public Safety Department',
  'Other': 'General Administration',
};

export function classifyIssueFallback(
  title: string,
  description: string,
  location: string,
  selectedCategory?: string,
  language: 'en' | 'ta' = 'en'
): AIAnalysisResult {
  const text = `${title} ${description} ${location}`.toLowerCase();

  let category: ComplaintCategory = 'Other';

  if (selectedCategory && selectedCategory !== 'Auto Detect with AI' && selectedCategory in CATEGORY_DEPARTMENT_MAP) {
    category = selectedCategory as ComplaintCategory;
  } else {
    // Keyword scoring
    const scores: Record<ComplaintCategory, number> = {
      'Road & Potholes': 0,
      'Waste Management': 0,
      'Streetlight Problems': 0,
      'Water Supply & Leakage': 0,
      'Drainage & Sewage': 0,
      'Public Safety': 0,
      'Other': 0,
    };

    const roadKeywords = ['pothole', 'road', 'asphalt', 'crater', 'tarmac', 'traffic', 'footpath', 'curb', 'highway', 'பள்ளம்', 'சாலை', 'தார்'];
    const wasteKeywords = ['garbage', 'trash', 'waste', 'bin', 'dump', 'litter', 'smell', 'stench', 'rubbish', 'debris', 'குப்பை', 'கழிவு', 'நாற்றம்'];
    const lightKeywords = ['streetlight', 'street light', 'lamp', 'dark', 'bulb', 'light', 'flicker', 'pole', 'blackout', 'மின்விளக்கு', 'தெருவிளக்கு', 'இருட்டு'];
    const waterKeywords = ['water', 'leak', 'pipe', 'pipeline', 'pressure', 'drinking water', 'burst', 'contamination', 'தண்ணீர்', 'குடிநீர்', 'குழாய்', 'கசிவு'];
    const drainKeywords = ['drain', 'drainage', 'sewage', 'sewer', 'manhole', 'gutter', 'overflow', 'blockage', 'clogged', 'கழிவுநீர்', 'சாக்கடை', 'மேன்ஹோல்'];
    const safetyKeywords = ['hazard', 'danger', 'wire', 'spark', 'collapse', 'fire', 'shock', 'accident', 'open pit', 'electrocution', 'ஆபத்து', 'விபத்து', 'தீ', 'மின்சாரம்'];

    roadKeywords.forEach((k) => { if (text.includes(k)) scores['Road & Potholes'] += 2; });
    wasteKeywords.forEach((k) => { if (text.includes(k)) scores['Waste Management'] += 2; });
    lightKeywords.forEach((k) => { if (text.includes(k)) scores['Streetlight Problems'] += 2; });
    waterKeywords.forEach((k) => { if (text.includes(k)) scores['Water Supply & Leakage'] += 2; });
    drainKeywords.forEach((k) => { if (text.includes(k)) scores['Drainage & Sewage'] += 2; });
    safetyKeywords.forEach((k) => { if (text.includes(k)) scores['Public Safety'] += 3; });

    let maxScore = 0;
    for (const [cat, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        category = cat as ComplaintCategory;
      }
    }
  }

  // Priority detection
  let priority: PriorityLevel = 'Medium';
  let urgencyReason = '';
  let suggestedAction = '';

  const criticalTriggers = ['open manhole', 'sparking', 'live wire', 'collapse', 'electrocution', 'fire', 'deep trench', 'severe flood', 'child fell', 'fatal', 'ஆபத்து', 'உயிர்'];
  const highTriggers = ['main road', 'bus stop', 'hospital', 'school', 'overflowing', 'flooding', 'huge', 'deep', 'blocked road', 'large', 'பெரிய', 'பள்ளி', 'பேருந்து'];
  const lowTriggers = ['minor', 'small', 'flicker', 'aesthetic', 'sign board', 'paint', 'சிறு', 'சிறிய'];

  const hasCritical = criticalTriggers.some((t) => text.includes(t));
  const hasHigh = highTriggers.some((t) => text.includes(t));
  const hasLow = lowTriggers.some((t) => text.includes(t));

  if (category === 'Public Safety' || hasCritical) {
    priority = 'Critical';
    urgencyReason = language === 'ta'
      ? 'பொதுமக்கள் உயிருக்கும் பாதுகாப்புக்கும் உடனடி அச்சுறுத்தல் உள்ளதால் உடனடி அவசர நடவடிக்கை தேவை.'
      : 'Immediate public hazard or safety threat detected requiring emergency intervention.';
    suggestedAction = language === 'ta'
      ? 'அவசரப் பிரிவை அனுப்பி எச்சரிக்கைப் பலகை அமைத்து உடனடியாகச் சரிசெய்யவும்.'
      : 'Deploy emergency field inspector immediately, cordon off the area, and dispatch response crew.';
  } else if (hasHigh || category === 'Drainage & Sewage' || category === 'Road & Potholes') {
    priority = 'High';
    urgencyReason = language === 'ta'
      ? 'முக்கிய பொதுமக்கள் கூடும் இடம் அல்லது போக்குவரத்து நெரிசல் ஏற்படும் பகுதி என்பதால் அதிக கவனம் தேவை.'
      : 'Infrastructure disruption located near high footfall or public transit area affecting multiple residents.';
    suggestedAction = language === 'ta'
      ? '24 மணி நேரத்திற்குள் கள ஆய்வு மேற்கொண்டு பழுதுபார்க்கும் பணியைத் திட்டமிடவும்.'
      : 'Issue priority maintenance work order within 24 hours and assign specialized repair crew.';
  } else if (hasLow) {
    priority = 'Low';
    urgencyReason = language === 'ta'
      ? 'பொதுமக்களுக்கு உடனடி ஆபத்து இல்லாத சிறிய குறைபாடு.'
      : 'Minor civic issue that does not present immediate functional or safety impediment.';
    suggestedAction = language === 'ta'
      ? 'வழக்கமான வாராந்திர பராமரிப்புப் பட்டியலில் சேர்க்கவும்.'
      : 'Log in routine municipal maintenance queue for scheduled zone sweep.';
  } else {
    priority = 'Medium';
    urgencyReason = language === 'ta'
      ? 'குறிப்பிட்ட குடியிருப்புப் பகுதி மக்களைப் பாதிக்கும் குறைபாடு.'
      : 'Local neighborhood disruption that impacts daily convenience for local residents.';
    suggestedAction = language === 'ta'
      ? 'துறை மேற்பார்வையாளர் ஆய்வு செய்து 48 மணி நேரத்தில் சரிசெய்ய நடவடிக்கை எடுக்கவும்.'
      : 'Dispatch zonal inspector to evaluate site and resolve within standard 48-hour municipal turnaround.';
  }

  const department = CATEGORY_DEPARTMENT_MAP[category] || 'General Administration';

  const summary = language === 'ta'
    ? `${location} பகுதியில் '${title}' குறித்து பதிவு செய்யப்பட்ட புகார். ${department} மூலம் தீர்வு காணப் பரிந்துரைக்கப்படுகிறது.`
    : `A civic grievance regarding "${title}" reported at ${location}. Routed to ${department} for departmental inspection.`;

  return {
    summary,
    category,
    priority,
    department,
    urgencyReason,
    confidence: 82,
    suggestedAction,
    analysisSource: 'Fallback',
  };
}

