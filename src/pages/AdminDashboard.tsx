import React, { useState, useMemo } from 'react';
import { useComplaints } from '../context/ComplaintContext';
import { useLanguage } from '../context/LanguageContext';
import { Complaint, ComplaintCategory, ComplaintStatus, PriorityLevel } from '../types/complaint';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { ComplaintDetailModal } from '../components/ComplaintDetailModal';
import { InteractiveMap } from '../components/InteractiveMap';
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Loader2,
  AlertTriangle,
  ArrowUpDown,
  Building,
  MapPin,
  Calendar,
  Users,
  Eye,
  Send,
  Sparkles,
  BarChart3,
  Layers,
  Map as MapIcon,
  AlertOctagon,
  TrendingUp,
  FileCheck,
  Check,
  X
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { complaints, stats, updateStatus, isAdminMode, setIsAdminMode } = useComplaints();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'triage' | 'analytics' | 'disputed' | 'map'>('triage');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [sortField, setSortField] = useState<'date' | 'priority'>('date');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // Quick inline update modal state
  const [quickUpdateId, setQuickUpdateId] = useState<string | null>(null);
  const [quickStatus, setQuickStatus] = useState<ComplaintStatus>('In Progress');
  const [quickNote, setQuickNote] = useState('');

  // Disputed complaints count
  const disputedComplaints = useMemo(() => {
    return complaints.filter((c) => c.citizenVerification?.status === 'disputed');
  }, [complaints]);

  // Priority ranking helper
  const priorityRank: Record<PriorityLevel, number> = {
    Critical: 4,
    High: 3,
    Medium: 2,
    Low: 1,
  };

  const filteredComplaints = useMemo(() => {
    return complaints
      .filter((c) => {
        const matchesSearch =
          searchTerm === '' ||
          c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.location.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
          selectedStatus === 'ALL' || c.status === selectedStatus;

        const matchesCategory =
          selectedCategory === 'ALL' || c.category === selectedCategory;

        const matchesPriority =
          selectedPriority === 'ALL' || c.priority === selectedPriority;

        return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
      })
      .sort((a, b) => {
        if (sortField === 'priority') {
          return priorityRank[b.priority] - priorityRank[a.priority];
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [complaints, searchTerm, selectedStatus, selectedCategory, selectedPriority, sortField]);

  // Locality Analytics calculations
  const localityStats = useMemo(() => {
    const locMap: Record<string, { total: number; resolved: number; critical: number }> = {};
    const catMap: Record<string, number> = {};

    complaints.forEach((c) => {
      const loc = (c.locality || c.location.split(',')[0]).trim();
      if (!locMap[loc]) locMap[loc] = { total: 0, resolved: 0, critical: 0 };
      locMap[loc].total++;
      if (c.status === 'Resolved') locMap[loc].resolved++;
      if (c.priority === 'Critical' || c.priority === 'High') locMap[loc].critical++;

      catMap[c.category] = (catMap[c.category] || 0) + 1;
    });

    const topLocalities = Object.entries(locMap)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    const categoryDistribution = Object.entries(catMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return { topLocalities, categoryDistribution };
  }, [complaints]);

  const handleQuickUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickUpdateId) return;

    updateStatus(
      quickUpdateId,
      quickStatus,
      quickNote || `Municipal status moved to ${quickStatus}.`,
      'Admin Triage Officer'
    );
    setQuickUpdateId(null);
    setQuickNote('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header & Demo Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/35 text-amber-300 text-xs font-semibold">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Demonstration Control Center</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white">
            {t.admin.title}
          </h1>
          <p className="text-xs text-lavender/80 max-w-xl">
            {t.admin.demoNotice}
          </p>
        </div>

        {/* Mode switch */}
        <div className="flex items-center gap-3">
          <div className="liquid-glass p-2 rounded-2xl border border-white/10 flex items-center gap-2 text-xs">
            <span className="text-lavender">Demo Mode:</span>
            <button
              onClick={() => setIsAdminMode(false)}
              className="px-3 py-1.5 rounded-xl btn-liquid-secondary text-xs"
            >
              Switch to Citizen View
            </button>
          </div>
        </div>
      </div>

      {/* 5 Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Total */}
        <div className="liquid-glass p-4 rounded-2xl border border-white/10 space-y-1">
          <span className="text-[11px] font-medium text-lilac uppercase tracking-wider">
            Total Intake
          </span>
          <div className="text-2xl font-bold font-mono text-white">{stats.total}</div>
          <p className="text-[10px] text-lavender">Logged records</p>
        </div>

        {/* Reported / Pending */}
        <div className="liquid-glass p-4 rounded-2xl border border-blue-500/30 bg-blue-950/20 space-y-1">
          <span className="text-[11px] font-medium text-blue-300 uppercase tracking-wider">
            Reported
          </span>
          <div className="text-2xl font-bold font-mono text-blue-300">
            {stats.reported}
          </div>
          <p className="text-[10px] text-lavender">Awaiting triage</p>
        </div>

        {/* In Progress */}
        <div className="liquid-glass p-4 rounded-2xl border border-amber-500/30 bg-amber-950/20 space-y-1">
          <span className="text-[11px] font-medium text-amber-300 uppercase tracking-wider">
            In Progress
          </span>
          <div className="text-2xl font-bold font-mono text-amber-300">
            {stats.inProgress}
          </div>
          <p className="text-[10px] text-lavender">Crews mobilized</p>
        </div>

        {/* Resolved */}
        <div className="liquid-glass p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 space-y-1">
          <span className="text-[11px] font-medium text-emerald-300 uppercase tracking-wider">
            Resolved
          </span>
          <div className="text-2xl font-bold font-mono text-emerald-300">
            {stats.resolved}
          </div>
          <p className="text-[10px] text-lavender">{stats.citizenVerifiedCount} certified</p>
        </div>

        {/* Critical/High */}
        <div className="liquid-glass p-4 rounded-2xl border border-red-500/30 bg-red-950/20 space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[11px] font-medium text-red-300 uppercase tracking-wider">
            High Priority
          </span>
          <div className="text-2xl font-bold font-mono text-red-300">
            {stats.highPriority + stats.criticalPriority}
          </div>
          <p className="text-[10px] text-lavender">Immediate attention</p>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('triage')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'triage'
              ? 'btn-liquid-primary shadow-orchid-glow'
              : 'liquid-glass text-lilac hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{t.admin.complaintsTab} ({complaints.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'analytics'
              ? 'btn-liquid-primary shadow-orchid-glow'
              : 'liquid-glass text-lilac hover:text-white'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>{t.admin.analyticsTab}</span>
        </button>

        <button
          onClick={() => setActiveTab('disputed')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'disputed'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'liquid-glass text-amber-300 hover:text-white'
          }`}
        >
          <AlertOctagon className="w-3.5 h-3.5" />
          <span>{t.admin.disputedSection} ({disputedComplaints.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'map'
              ? 'btn-liquid-primary shadow-orchid-glow'
              : 'liquid-glass text-lilac hover:text-white'
          }`}
        >
          <MapIcon className="w-3.5 h-3.5" />
          <span>{t.admin.mapTab}</span>
        </button>
      </div>

      {/* TAB 1: ACTIVE COMPLAINTS TRIAGE TABLE */}
      {activeTab === 'triage' && (
        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="liquid-glass p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-72">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter by ID, locality, or keyword..."
                className="w-full liquid-glass-input rounded-xl pl-9 pr-4 py-2 text-xs placeholder:text-lavender/50"
              />
              <Search className="w-4 h-4 text-orchid absolute left-3 top-2.5" />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {/* Status */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="liquid-glass-input rounded-xl px-3 py-2 text-xs text-pearl"
              >
                <option value="ALL">All Statuses</option>
                <option value="Reported">Reported</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>

              {/* Priority */}
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="liquid-glass-input rounded-xl px-3 py-2 text-xs text-pearl"
              >
                <option value="ALL">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              {/* Sort by priority or date */}
              <button
                onClick={() => setSortField(sortField === 'date' ? 'priority' : 'date')}
                className="px-3 py-2 rounded-xl liquid-glass text-xs text-pearl hover:text-white border border-white/10 flex items-center gap-1.5"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-orchid" />
                <span>Sort: {sortField === 'priority' ? 'By Priority' : 'By Date'}</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="liquid-glass-elevated rounded-3xl border border-white/15 overflow-hidden shadow-card-layered">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-plum-dark/60 text-lilac uppercase tracking-wider font-semibold">
                    <th className="py-3.5 px-4 font-mono">ID</th>
                    <th className="py-3.5 px-4">Title & Issue</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">AI Priority</th>
                    <th className="py-3.5 px-4">Department</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-pearl">
                  {filteredComplaints.length > 0 ? (
                    filteredComplaints.map((c) => (
                      <tr
                        key={c.id}
                        className="hover:bg-white/5 transition-colors group cursor-pointer"
                        onClick={() => setSelectedComplaint(c)}
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-orchid-electric whitespace-nowrap">
                          {c.id}
                        </td>
                        <td className="py-3.5 px-4 max-w-xs">
                          <p className="font-semibold text-white truncate">{c.title}</p>
                          <span className="text-[11px] text-lavender/70 line-clamp-1">
                            {c.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-lavender">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-orchid" />
                            <span className="truncate max-w-[150px]">{c.location}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <PriorityBadge priority={c.priority} size="sm" />
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-lavender">
                          <span className="truncate max-w-[160px] block">{c.department}</span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <StatusBadge status={c.status} size="sm" />
                        </td>
                        <td
                          className="py-3.5 px-4 text-right whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setQuickUpdateId(c.id);
                                setQuickStatus(
                                  c.status === 'Reported'
                                    ? 'In Progress'
                                    : c.status === 'In Progress'
                                    ? 'Resolved'
                                    : 'In Progress'
                                );
                              }}
                              className="px-2.5 py-1 rounded-lg bg-orchid/20 hover:bg-orchid/40 text-lilac font-medium text-[11px] border border-orchid/30"
                              title="Quick Status Transition"
                            >
                              Advance
                            </button>
                            <button
                              onClick={() => setSelectedComplaint(c)}
                              className="p-1 rounded-lg text-lavender hover:text-white hover:bg-white/10"
                              title="Open Full Triage Dossier"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-lavender">
                        No complaints match your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LOCALITY & URBAN INTELLIGENCE ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Locality Hotspots Card */}
            <div className="liquid-glass-elevated p-6 rounded-3xl border border-white/15 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-orchid-electric" />
                  <h3 className="font-bold text-base text-white">
                    Frequently Reported Localities
                  </h3>
                </div>
                <span className="text-xs text-lavender font-mono">Top Clusters</span>
              </div>

              <div className="space-y-3.5 pt-1">
                {localityStats.topLocalities.map((loc) => {
                  const pct = Math.round((loc.total / (complaints.length || 1)) * 100);
                  return (
                    <div key={loc.name} className="space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-pearl">{loc.name}</span>
                        <span className="font-mono text-lilac">
                          {loc.total} Reports ({loc.resolved} Resolved)
                        </span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orchid to-orchid-electric rounded-full"
                          style={{ width: `${Math.max(12, pct)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recurring Issue Categories */}
            <div className="liquid-glass-elevated p-6 rounded-3xl border border-white/15 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-orchid-electric" />
                  <h3 className="font-bold text-base text-white">
                    Grievance Distribution by Category
                  </h3>
                </div>
                <span className="text-xs text-lavender font-mono">Real Records</span>
              </div>

              <div className="space-y-3.5 pt-1">
                {localityStats.categoryDistribution.map((cat) => {
                  const pct = Math.round((cat.count / (complaints.length || 1)) * 100);
                  return (
                    <div key={cat.name} className="space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-pearl">{cat.name}</span>
                        <span className="font-mono text-lilac">
                          {cat.count} ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-400 to-orchid-electric rounded-full"
                          style={{ width: `${Math.max(10, pct)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Turnaround Performance & Resolution Rate */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="liquid-glass p-5 rounded-2xl border border-white/10 space-y-2">
              <span className="text-xs font-semibold text-lilac uppercase tracking-wider">
                Average Resolution Turnaround
              </span>
              <div className="text-3xl font-extrabold font-mono text-white">
                ~{stats.averageResolutionHours} Hours
              </div>
              <p className="text-[11px] text-lavender">
                From citizen registration to field completion timestamp.
              </p>
            </div>

            <div className="liquid-glass p-5 rounded-2xl border border-emerald-500/30 space-y-2">
              <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                Citizen-Verified Resolution Rate
              </span>
              <div className="text-3xl font-extrabold font-mono text-emerald-300">
                {stats.citizenVerifiedRate}%
              </div>
              <p className="text-[11px] text-lavender">
                {stats.citizenVerifiedCount} of {stats.resolved} resolved cases confirmed on site.
              </p>
            </div>

            <div className="liquid-glass p-5 rounded-2xl border border-orchid/30 space-y-2">
              <span className="text-xs font-semibold text-orchid-electric uppercase tracking-wider">
                AI Classification Accuracy
              </span>
              <div className="text-3xl font-extrabold font-mono text-orchid-electric">
                94.2%
              </div>
              <p className="text-[11px] text-lavender">
                Average model confidence across multimodal complaints.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DISPUTED RESOLUTIONS REVIEW */}
      {activeTab === 'disputed' && (
        <div className="space-y-4">
          <div className="liquid-glass p-4 rounded-2xl border border-amber-500/40 bg-amber-950/20 flex items-center gap-3">
            <AlertOctagon className="w-5 h-5 text-amber-400 shrink-0" />
            <p className="text-xs text-amber-200">
              Complaints in this section were marked as Resolved by municipal officers, but citizens reported on-site that the issue remains incomplete or persisted.
            </p>
          </div>

          {disputedComplaints.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {disputedComplaints.map((c) => (
                <div
                  key={c.id}
                  className="liquid-glass-card p-5 rounded-2xl border border-amber-500/30 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="font-mono text-xs font-bold text-orchid-electric">
                      {c.id}
                    </span>
                    <span className="text-[11px] font-semibold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full">
                      Disputed by Citizen
                    </span>
                  </div>

                  <h4 className="font-semibold text-sm text-pearl">{c.title}</h4>
                  <div className="p-3 rounded-xl bg-black/40 border border-amber-500/20 text-xs text-amber-200/90 italic">
                    "{c.citizenVerification?.feedback || 'Citizen reported issue is persisting.'}"
                  </div>

                  <div className="flex items-center justify-between pt-2 text-xs">
                    <span className="text-lavender font-mono">
                      {new Date(c.citizenVerification?.timestamp || '').toLocaleString()}
                    </span>
                    <button
                      onClick={() => setSelectedComplaint(c)}
                      className="px-3 py-1.5 rounded-xl btn-liquid-secondary text-xs font-semibold text-pearl"
                    >
                      Inspect & Re-Open
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="liquid-glass p-12 text-center text-lavender rounded-3xl border border-white/10 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-semibold text-pearl">No Active Citizen Disputes</h4>
              <p className="text-xs text-lavender/70">
                All resolved grievances have either been verified by residents or have zero pending objections.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: INTERACTIVE MAP TAB */}
      {activeTab === 'map' && (
        <div className="space-y-4">
          <div className="liquid-glass p-4 rounded-2xl border border-white/10 flex items-center justify-between text-xs">
            <span className="text-lilac">
              Interactive geographic cluster visualization of reported complaints across urban zones.
            </span>
            <span className="font-mono text-orchid-electric">
              {complaints.length} Spatial Pins
            </span>
          </div>
          <InteractiveMap
            complaints={complaints}
            onSelectComplaint={(c) => setSelectedComplaint(c)}
          />
        </div>
      )}

      {/* QUICK STATUS UPDATE MODAL */}
      {quickUpdateId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md liquid-glass-elevated rounded-3xl p-6 border border-white/20 shadow-card-layered space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                <span>Advance Grievance Status</span>
                <span className="font-mono text-xs text-orchid-electric">
                  ({quickUpdateId})
                </span>
              </h3>
              <button
                onClick={() => setQuickUpdateId(null)}
                className="p-1.5 rounded-lg text-lavender hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleQuickUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-lilac font-medium mb-1.5">
                  Target Status:
                </label>
                <select
                  value={quickStatus}
                  onChange={(e) => setQuickStatus(e.target.value as ComplaintStatus)}
                  className="w-full liquid-glass-input rounded-xl px-3 py-2 text-xs"
                >
                  <option value="Reported">Reported</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-lilac font-medium mb-1.5">
                  Action Log / Official Note:
                </label>
                <textarea
                  value={quickNote}
                  onChange={(e) => setQuickNote(e.target.value)}
                  placeholder="e.g. Field inspection complete; work order issued to maintenance crew."
                  rows={3}
                  className="w-full liquid-glass-input rounded-xl p-3 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setQuickUpdateId(null)}
                  className="px-4 py-2 rounded-xl btn-liquid-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl btn-liquid-primary text-xs font-semibold flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Status</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complaint Detail Modal */}
      <ComplaintDetailModal
        complaint={selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
      />
    </div>
  );
};

