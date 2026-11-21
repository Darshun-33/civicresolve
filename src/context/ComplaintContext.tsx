import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Complaint,
  ComplaintStatus,
  DashboardStats,
  CitizenVerification
} from '../types/complaint';
import {
  getStoredComplaints,
  saveAllComplaints,
  saveComplaint,
  updateComplaintStatus,
  updateCitizenVerification,
  corroborateComplaint,
  calculateStats,
  loadDemoComplaints,
  clearDemoComplaints,
} from '../services/storage';
import {
  fetchComplaints,
  createComplaintApi,
  updateComplaintStatusApi,
  verifyResolutionApi,
  corroborateComplaintApi,
  loadDemoComplaintsApi,
  clearDemoComplaintsApi,
  syncComplaintsApi,
} from '../services/api';

interface ComplaintContextType {
  complaints: Complaint[];
  stats: DashboardStats;
  isAdminMode: boolean;
  setIsAdminMode: (mode: boolean) => void;
  isDemoWalkthroughOpen: boolean;
  setIsDemoWalkthroughOpen: (open: boolean) => void;
  refreshComplaints: () => Promise<void>;
  addComplaint: (complaint: Complaint) => Promise<Complaint>;
  updateStatus: (id: string, status: ComplaintStatus, note: string, actor?: string) => Promise<Complaint | null>;
  verifyResolution: (id: string, verification: CitizenVerification) => Promise<Complaint | null>;
  supportComplaint: (id: string) => Promise<Complaint | null>;
  loadDemo: () => Promise<void>;
  clearDemo: () => Promise<void>;
}

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

export const ComplaintProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    // Initial state from cached local storage for instant zero-flicker render
    return getStoredComplaints();
  });

  const [stats, setStats] = useState<DashboardStats>(() => {
    return calculateStats(getStoredComplaints());
  });

  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    return localStorage.getItem('civicresolve_admin_mode') === 'true';
  });

  const [isDemoWalkthroughOpen, setIsDemoWalkthroughOpen] = useState(false);

  const refreshComplaints = useCallback(async () => {
    try {
      const list = await fetchComplaints();
      setComplaints(list);
      setStats(calculateStats(list));
      saveAllComplaints(list);
    } catch (err) {
      console.warn('[CivicResolve] refreshComplaints failed, using local cache:', err);
      const local = getStoredComplaints();
      setComplaints(local);
      setStats(calculateStats(local));
    }
  }, []);

  // Initial load, localStorage migration to backend, and real-time polling across devices
  useEffect(() => {
    let isMounted = true;

    async function initializeAndSync() {
      try {
        const serverComplaints = await fetchComplaints();
        if (!isMounted) return;

        // Check if browser has non-demo complaints saved in localStorage not yet present on backend
        const localList = getStoredComplaints();
        const unsynced = localList.filter(
          (lc) => !lc.isDemo && !serverComplaints.some((sc) => sc.id.toUpperCase() === lc.id.toUpperCase())
        );

        let activeComplaints = serverComplaints;
        if (unsynced.length > 0) {
          console.log(`[CivicResolve] Migrating ${unsynced.length} local complaint(s) to shared backend...`);
          activeComplaints = await syncComplaintsApi(unsynced);
        }

        if (isMounted) {
          setComplaints(activeComplaints);
          setStats(calculateStats(activeComplaints));
          saveAllComplaints(activeComplaints);
        }
      } catch (err) {
        console.warn('[CivicResolve] Backend initialization error, falling back to local storage:', err);
        const fallback = getStoredComplaints();
        if (fallback.length === 0) {
          const demo = loadDemoComplaints();
          if (isMounted) {
            setComplaints(demo);
            setStats(calculateStats(demo));
          }
        }
      }
    }

    initializeAndSync();

    // Auto-polling (every 3.5s) ensures changes on laptop reflect on phone and vice versa without manual refresh
    const pollInterval = setInterval(async () => {
      try {
        const latest = await fetchComplaints();
        if (!isMounted) return;

        setComplaints((prev) => {
          const prevKey = prev
            .map((c) => `${c.id}:${c.status}:${c.updatedAt}:${c.corroborationCount}:${c.citizenVerification?.status}:${!!c.imageDataUrl}`)
            .join('|');
          const latestKey = latest
            .map((c) => `${c.id}:${c.status}:${c.updatedAt}:${c.corroborationCount}:${c.citizenVerification?.status}:${!!c.imageDataUrl}`)
            .join('|');

          if (prevKey !== latestKey) {
            setStats(calculateStats(latest));
            saveAllComplaints(latest);
            return latest;
          }
          return prev;
        });
      } catch {
        // Silently tolerate temporary polling network drops
      }
    }, 3500);

    // Immediate sync when tab receives focus or becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchComplaints()
          .then((latest) => {
            if (isMounted) {
              setComplaints(latest);
              setStats(calculateStats(latest));
              saveAllComplaints(latest);
            }
          })
          .catch(() => {});
      }
    };

    window.addEventListener('focus', handleVisibilityChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
      window.removeEventListener('focus', handleVisibilityChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleSetAdminMode = (mode: boolean) => {
    setIsAdminMode(mode);
    localStorage.setItem('civicresolve_admin_mode', mode ? 'true' : 'false');
  };

  const addComplaint = useCallback(async (complaint: Complaint): Promise<Complaint> => {
    // Optimistic update for instant responsiveness
    saveComplaint(complaint);
    setComplaints((prev) => {
      const filtered = prev.filter((c) => c.id !== complaint.id);
      const updated = [complaint, ...filtered];
      setStats(calculateStats(updated));
      return updated;
    });

    try {
      const created = await createComplaintApi(complaint);
      await refreshComplaints();
      return created;
    } catch (err) {
      console.error('[CivicResolve] Failed to create complaint on backend:', err);
      return complaint;
    }
  }, [refreshComplaints]);

  const updateStatus = useCallback(async (
    id: string,
    status: ComplaintStatus,
    note: string,
    actor = 'Municipal Officer'
  ): Promise<Complaint | null> => {
    // Optimistic update
    const localUpdated = updateComplaintStatus(id, status, note, actor);
    if (localUpdated) {
      setComplaints((prev) => {
        const next = prev.map((c) => (c.id === id ? localUpdated : c));
        setStats(calculateStats(next));
        saveAllComplaints(next);
        return next;
      });
    }

    try {
      const serverUpdated = await updateComplaintStatusApi(id, status, note, actor);
      await refreshComplaints();
      return serverUpdated || localUpdated;
    } catch (err) {
      console.error('[CivicResolve] Failed to update status on backend:', err);
      return localUpdated;
    }
  }, [refreshComplaints]);

  const verifyResolution = useCallback(async (
    id: string,
    verification: CitizenVerification
  ): Promise<Complaint | null> => {
    const localUpdated = updateCitizenVerification(id, verification);
    if (localUpdated) {
      setComplaints((prev) => {
        const next = prev.map((c) => (c.id === id ? localUpdated : c));
        setStats(calculateStats(next));
        saveAllComplaints(next);
        return next;
      });
    }

    try {
      const serverUpdated = await verifyResolutionApi(id, verification);
      await refreshComplaints();
      return serverUpdated || localUpdated;
    } catch (err) {
      console.error('[CivicResolve] Failed to verify resolution on backend:', err);
      return localUpdated;
    }
  }, [refreshComplaints]);

  const supportComplaint = useCallback(async (id: string): Promise<Complaint | null> => {
    const localUpdated = corroborateComplaint(id);
    if (localUpdated) {
      setComplaints((prev) => {
        const next = prev.map((c) => (c.id === id ? localUpdated : c));
        setStats(calculateStats(next));
        saveAllComplaints(next);
        return next;
      });
    }

    try {
      const serverUpdated = await corroborateComplaintApi(id);
      await refreshComplaints();
      return serverUpdated || localUpdated;
    } catch (err) {
      console.error('[CivicResolve] Failed to corroborate complaint on backend:', err);
      return localUpdated;
    }
  }, [refreshComplaints]);

  const loadDemo = useCallback(async () => {
    try {
      const list = await loadDemoComplaintsApi();
      setComplaints(list);
      setStats(calculateStats(list));
      saveAllComplaints(list);
    } catch (err) {
      console.error('[CivicResolve] Failed to load demo on backend:', err);
      const demo = loadDemoComplaints();
      setComplaints(demo);
      setStats(calculateStats(demo));
    }
  }, []);

  const clearDemo = useCallback(async () => {
    try {
      const remaining = await clearDemoComplaintsApi();
      setComplaints(remaining);
      setStats(calculateStats(remaining));
      saveAllComplaints(remaining);
    } catch (err) {
      console.error('[CivicResolve] Failed to clear demo on backend:', err);
      const remaining = clearDemoComplaints();
      setComplaints(remaining);
      setStats(calculateStats(remaining));
    }
  }, []);

  return (
    <ComplaintContext.Provider
      value={{
        complaints,
        stats,
        isAdminMode,
        setIsAdminMode: handleSetAdminMode,
        isDemoWalkthroughOpen,
        setIsDemoWalkthroughOpen,
        refreshComplaints,
        addComplaint,
        updateStatus,
        verifyResolution,
        supportComplaint,
        loadDemo,
        clearDemo,
      }}
    >
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaints = (): ComplaintContextType => {
  const context = useContext(ComplaintContext);
  if (!context) {
    throw new Error('useComplaints must be used within a ComplaintProvider');
  }
  return context;
};
