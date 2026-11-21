import { Complaint, ComplaintStatus, DashboardStats, CitizenVerification, TimelineEvent } from '../types/complaint';
import { getDemoComplaints } from '../data/demoComplaints';

export { getDemoComplaints };

const STORAGE_KEY = 'civicresolve_complaints_v1';

export function generateComplaintId(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `CR-${year}-${random}`;
}

export function getStoredComplaints(): Complaint[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading complaints from localStorage:', err);
    return [];
  }
}

export function saveAllComplaints(complaints: Complaint[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
  } catch (err) {
    console.error('Failed to save complaints to localStorage (quota exceeded?):', err);
    // If quota exceeded due to large base64 images, strip old demo images or warn
    const stripped = complaints.map(c => ({
      ...c,
      imageDataUrl: c.isDemo ? undefined : c.imageDataUrl
    }));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stripped));
    } catch (e) {
      console.error('Critical quota error saving stripped data:', e);
    }
  }
}

export function saveComplaint(complaint: Complaint): void {
  const list = getStoredComplaints();
  const existingIndex = list.findIndex(c => c.id === complaint.id);
  if (existingIndex >= 0) {
    list[existingIndex] = complaint;
  } else {
    list.unshift(complaint);
  }
  saveAllComplaints(list);
}

export function getComplaintById(id: string): Complaint | undefined {
  const list = getStoredComplaints();
  const normalized = id.trim().toUpperCase();
  return list.find(c => c.id.toUpperCase() === normalized);
}

export function updateComplaintStatus(
  id: string,
  newStatus: ComplaintStatus,
  note: string,
  actor: string = 'Municipal Officer'
): Complaint | null {
  const list = getStoredComplaints();
  const complaint = list.find(c => c.id.toUpperCase() === id.trim().toUpperCase());
  if (!complaint) return null;

  const now = new Date().toISOString();
  complaint.status = newStatus;
  complaint.updatedAt = now;

  const timelineEvent: TimelineEvent = {
    id: `tl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    status: newStatus,
    timestamp: now,
    note: note || `Status updated to ${newStatus} by ${actor}.`,
    actor,
  };

  complaint.timeline.push(timelineEvent);
  saveAllComplaints(list);
  return complaint;
}

export function updateCitizenVerification(
  id: string,
  verification: CitizenVerification
): Complaint | null {
  const list = getStoredComplaints();
  const complaint = list.find(c => c.id.toUpperCase() === id.trim().toUpperCase());
  if (!complaint) return null;

  complaint.citizenVerification = verification;
  complaint.updatedAt = new Date().toISOString();

  const note = verification.status === 'verified'
    ? 'Citizen confirmed on-site that the issue has been successfully resolved.'
    : `Citizen disputed the resolution: "${verification.feedback || 'Issue is still persisting on-site'}". Flagged for administrative re-inspection.`;

  complaint.timeline.push({
    id: `tl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    status: complaint.status,
    timestamp: new Date().toISOString(),
    note,
    actor: 'Citizen Inspector',
  });

  saveAllComplaints(list);
  return complaint;
}

export function corroborateComplaint(id: string): Complaint | null {
  const list = getStoredComplaints();
  const complaint = list.find(c => c.id.toUpperCase() === id.trim().toUpperCase());
  if (!complaint) return null;

  complaint.corroborationCount = (complaint.corroborationCount || 0) + 1;
  complaint.updatedAt = new Date().toISOString();

  complaint.timeline.push({
    id: `tl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    status: complaint.status,
    timestamp: new Date().toISOString(),
    note: `Another citizen corroborated this report (+1). Total citizen reports: ${complaint.corroborationCount + 1}`,
    actor: 'Citizen Community',
  });

  saveAllComplaints(list);
  return complaint;
}

/**
 * Intelligent Duplicate Complaint Detection
 * Compares category, normalized locality, and text similarity.
 */
export function findDuplicateComplaints(
  title: string,
  description: string,
  location: string,
  category: string,
  customList?: Complaint[]
): Complaint[] {
  const list = customList && customList.length > 0 ? customList : getStoredComplaints();
  if (list.length === 0) return [];

  const normTitle = title.toLowerCase().trim();
  const normDesc = description.toLowerCase().trim();
  const normLoc = location.toLowerCase().trim();
  if (!normTitle && !normLoc) return [];

  const getWords = (str: string) => str.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2);
  const inputWords = new Set([...getWords(normTitle), ...getWords(normDesc), ...getWords(normLoc)]);

  return list.filter(item => {
    // Check category match or similar category
    const catMatch = category && category !== 'Auto Detect with AI' && item.category === category;

    // Check locality match
    const itemLocWords = getWords(item.location);
    const locOverlap = itemLocWords.filter(w => inputWords.has(w)).length;
    const hasLocationSimilarity = locOverlap >= 1;

    // Check text similarity (Jaccard-like overlap of substantive words)
    const itemWords = getWords(`${item.title} ${item.description}`);
    const textOverlap = itemWords.filter(w => inputWords.has(w)).length;
    const isTextSimilar = textOverlap >= 2;

    // High potential duplicate if:
    // (category matches AND (location matches OR text is similar)) OR (strong location + text overlap)
    return (catMatch && (hasLocationSimilarity || isTextSimilar)) || (hasLocationSimilarity && textOverlap >= 3);
  });
}

export function calculateStats(complaints: Complaint[]): DashboardStats {
  const total = complaints.length;
  let reported = 0;
  let inProgress = 0;
  let resolved = 0;
  let highPriority = 0;
  let criticalPriority = 0;
  let citizenVerifiedCount = 0;
  let totalResolutionHours = 0;
  let resolvedWithDurationCount = 0;

  for (const c of complaints) {
    if (c.status === 'Reported') reported++;
    else if (c.status === 'In Progress') inProgress++;
    else if (c.status === 'Resolved') {
      resolved++;
      if (c.citizenVerification?.status === 'verified') {
        citizenVerifiedCount++;
      }
      // Calculate turnaround from creation to last resolved timeline event
      const resolvedEvent = c.timeline.find(t => t.status === 'Resolved');
      if (resolvedEvent) {
        const createdMs = new Date(c.createdAt).getTime();
        const resolvedMs = new Date(resolvedEvent.timestamp).getTime();
        const hours = Math.max(1, (resolvedMs - createdMs) / (1000 * 60 * 60));
        totalResolutionHours += hours;
        resolvedWithDurationCount++;
      }
    }

    if (c.priority === 'High') highPriority++;
    else if (c.priority === 'Critical') criticalPriority++;
  }

  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
  const citizenVerifiedRate = resolved > 0 ? Math.round((citizenVerifiedCount / resolved) * 100) : 0;
  const averageResolutionHours = resolvedWithDurationCount > 0 ? Math.round(totalResolutionHours / resolvedWithDurationCount) : 24;

  return {
    total,
    reported,
    inProgress,
    resolved,
    highPriority,
    criticalPriority,
    resolutionRate,
    citizenVerifiedCount,
    citizenVerifiedRate,
    averageResolutionHours,
  };
}

export function loadDemoComplaints(): Complaint[] {
  const current = getStoredComplaints();
  // Filter out any existing demo items to prevent duplicates
  const nonDemo = current.filter(c => !c.isDemo);
  const demoItems = getDemoComplaints();
  const merged = [...demoItems, ...nonDemo];
  saveAllComplaints(merged);
  return merged;
}

export function clearDemoComplaints(): Complaint[] {
  const current = getStoredComplaints();
  const filtered = current.filter(c => !c.isDemo);
  saveAllComplaints(filtered);
  return filtered;
}

export async function compressImage(file: File, maxWidth = 1000, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}
