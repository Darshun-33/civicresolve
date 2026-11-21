import React, { useState, useMemo } from 'react';
import { useComplaints } from '../context/ComplaintContext';
import { useLanguage } from '../context/LanguageContext';
import { Complaint, ComplaintCategory, ComplaintStatus } from '../types/complaint';
import { ComplaintCard } from '../components/ComplaintCard';
import { ComplaintDetailModal } from '../components/ComplaintDetailModal';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import {
  LayoutDashboard,
  Search,
  Filter,
  PlusCircle,
  Clock,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ArrowUpDown,
  Building,
  MapPin,
  Calendar,
  Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ALL_CATEGORIES: ComplaintCategory[] = [
  'Road & Potholes',
  'Waste Management',
  'Streetlight Problems',
  'Water Supply & Leakage',
  'Drainage & Sewage',
  'Public Safety',
  'Other',
];

export const CitizenDashboard: React.FC = () => {
  const { complaints, stats } = useComplaints();
  const { t } = useLanguage();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

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

        return matchesSearch && matchesStatus && matchesCategory;
      })
      .sort((a, b) => {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
      });
  }, [complaints, searchTerm, selectedStatus, selectedCategory, sortOrder]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-orchid-electric uppercase tracking-wider">
            <LayoutDashboard className="w-4 h-4" />
            <span>Community Oversight</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
            {t.dashboard.title}
          </h1>
          <p className="text-sm text-lilac/80">{t.dashboard.subtitle}</p>
        </div>

        <Link
          to="/report"
          className="self-start sm:self-auto px-5 py-2.5 rounded-2xl btn-liquid-primary text-xs font-semibold flex items-center gap-2 shadow-orchid-glow"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report New Grievance</span>
        </Link>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total */}
        <div className="liquid-glass-elevated p-5 rounded-3xl border border-white/15 space-y-1">
          <div className="flex items-center justify-between text-xs text-lilac font-medium">
            <span>{t.dashboard.totalReported}</span>
            <Layers className="w-4 h-4 text-orchid" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white">
            {stats.total}
          </div>
          <span className="text-[11px] text-lavender/70">Total logged complaints</span>
        </div>

        {/* In Progress */}
        <div className="liquid-glass-elevated p-5 rounded-3xl border border-amber-500/30 bg-amber-950/15 space-y-1">
          <div className="flex items-center justify-between text-xs text-amber-300 font-medium">
            <span>{t.dashboard.inProgress}</span>
            <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-amber-300">
            {stats.inProgress}
          </div>
          <span className="text-[11px] text-lavender/70">Actively being serviced</span>
        </div>

        {/* Resolved */}
        <div className="liquid-glass-elevated p-5 rounded-3xl border border-emerald-500/30 bg-emerald-950/15 space-y-1">
          <div className="flex items-center justify-between text-xs text-emerald-300 font-medium">
            <span>{t.dashboard.resolved}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-300">
            {stats.resolved}
          </div>
          <span className="text-[11px] text-lavender/70">
            {stats.citizenVerifiedCount} certified by citizens
          </span>
        </div>

        {/* High / Critical */}
        <div className="liquid-glass-elevated p-5 rounded-3xl border border-red-500/30 bg-red-950/15 space-y-1">
          <div className="flex items-center justify-between text-xs text-red-300 font-medium">
            <span>{t.dashboard.highCritical}</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-red-400">
            {stats.highPriority + stats.criticalPriority}
          </div>
          <span className="text-[11px] text-lavender/70">Elevated urgency attention</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="liquid-glass p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.dashboard.searchFilter}
            className="w-full liquid-glass-input rounded-xl pl-9 pr-4 py-2 text-xs placeholder:text-lavender/50"
          />
          <Search className="w-4 h-4 text-orchid absolute left-3 top-2.5" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="liquid-glass-input rounded-xl px-3 py-2 text-xs text-pearl"
          >
            <option value="ALL">{t.dashboard.allStatuses}</option>
            <option value="Reported">Reported</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="liquid-glass-input rounded-xl px-3 py-2 text-xs text-pearl"
          >
            <option value="ALL">{t.dashboard.allCategories}</option>
            {ALL_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Sort order */}
          <button
            onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
            className="px-3 py-2 rounded-xl liquid-glass text-xs text-pearl hover:text-white border border-white/10 flex items-center gap-1.5"
            title="Toggle sort direction"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-orchid" />
            <span>{sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}</span>
          </button>
        </div>
      </div>

      {/* Complaints Grid */}
      {filteredComplaints.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComplaints.map((complaint) => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
              onOpenDetails={(c) => setSelectedComplaint(c)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="liquid-glass-elevated rounded-3xl p-12 text-center space-y-4 border border-white/10">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-lavender">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-xl text-white">
            {t.dashboard.noComplaints}
          </h3>
          <p className="text-sm text-lilac/80 max-w-md mx-auto">
            {t.dashboard.noComplaintsDesc}
          </p>
          <div className="pt-2">
            <Link
              to="/report"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl btn-liquid-primary text-xs font-semibold"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.dashboard.reportFirst}</span>
            </Link>
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

