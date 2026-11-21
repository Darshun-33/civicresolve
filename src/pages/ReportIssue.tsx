import React, { useState, useEffect, useId } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useComplaints } from '../context/ComplaintContext';
import { useLanguage } from '../context/LanguageContext';
import { ComplaintCategory, Complaint, AIAnalysisResult } from '../types/complaint';
import { generateComplaintId, findDuplicateComplaints, compressImage } from '../services/storage';
import { getApiBaseUrl } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import {
  Sparkles,
  Upload,
  X,
  AlertCircle,
  CheckCircle2,
  MapPin,
  Building,
  Clock,
  ArrowRight,
  ShieldAlert,
  Users,
  Search,
  Eye,
  Camera,
  Layers,
  HelpCircle,
  FileText
} from 'lucide-react';

const CATEGORIES: ComplaintCategory[] = [
  'Road & Potholes',
  'Waste Management',
  'Streetlight Problems',
  'Water Supply & Leakage',
  'Drainage & Sewage',
  'Public Safety',
  'Other',
];

export const ReportIssue: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addComplaint, supportComplaint, complaints } = useComplaints();
  const { language, t } = useLanguage();

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<string>('Auto Detect with AI');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Validation State
  const [errors, setErrors] = useState<{ title?: string; description?: string; location?: string }>({});

  // Duplicate Detection State
  const [detectedDuplicates, setDetectedDuplicates] = useState<Complaint[]>([]);
  const [showDuplicateBanner, setShowDuplicateBanner] = useState(false);
  const [dismissDuplicate, setDismissDuplicate] = useState(false);

  // Submission & AI Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiStage, setAiStage] = useState(0);
  const [submittedComplaint, setSubmittedComplaint] = useState<Complaint | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Check for pre-filled demo duplicate param from Walkthrough
  useEffect(() => {
    if (searchParams.get('demoDuplicate') === 'true') {
      setTitle('Pothole causing dangerous swerving near bus depot');
      setDescription('A large road crater near the depot exit is slowing buses and posing collision hazard.');
      setLocation('Anna Nagar West Bus Terminus, Chennai');
      setCategory('Road & Potholes');
    }
  }, [searchParams]);

  // Real-time Duplicate Detection check on title / location / category changes
  useEffect(() => {
    if (dismissDuplicate) return;

    if (title.trim().length > 5 || location.trim().length > 4) {
      const duplicates = findDuplicateComplaints(title, description, location, category, complaints);
      if (duplicates.length > 0) {
        setDetectedDuplicates(duplicates);
        setShowDuplicateBanner(true);
      } else {
        setShowDuplicateBanner(false);
      }
    } else {
      setShowDuplicateBanner(false);
    }
  }, [title, description, location, category, dismissDuplicate, complaints]);

  // Handle Image Upload & Compression
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      alert('Only JPEG, JPG, and PNG files are supported.');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      alert('Image size exceeds 8MB. Please select a smaller photo.');
      return;
    }

    try {
      setImageFile(file);
      const compressedDataUrl = await compressImage(file, 900, 0.7);
      setImagePreview(compressedDataUrl);
    } catch (err) {
      console.error('Failed to compress image:', err);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSupportExisting = (existingId: string) => {
    supportComplaint(existingId);
    navigate(`/track?id=${existingId}&supported=true`);
  };

  const validate = () => {
    const newErrors: { title?: string; description?: string; location?: string } = {};
    if (!title.trim()) newErrors.title = 'Complaint title is required.';
    else if (title.trim().length < 5) newErrors.title = 'Title must be at least 5 characters.';

    if (!description.trim()) newErrors.description = 'Detailed description is required.';
    else if (description.trim().length < 10) newErrors.description = 'Description must be at least 10 characters.';

    if (!location.trim()) newErrors.location = 'Location or landmark address is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsAnalyzing(true);
    setAiStage(1);

    // Dynamic stage progression animation
    const stageTimer1 = setTimeout(() => setAiStage(2), 700);
    const stageTimer2 = setTimeout(() => setAiStage(3), 1400);

    try {
      // Call Backend AI Endpoint
      const response = await fetch(`${getApiBaseUrl()}/analyze-issue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          location: location.trim(),
          category: category !== 'Auto Detect with AI' ? category : undefined,
          image: imagePreview || undefined,
          language,
        }),
      });

      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      setAiStage(4);

      let analysis: AIAnalysisResult;

      if (response.ok) {
        const data = await response.json();
        analysis = data.analysis;
      } else {
        throw new Error('Backend AI analysis call failed');
      }

      // Small pause to let the final stage shine
      await new Promise((res) => setTimeout(res, 600));

      const newId = generateComplaintId();
      const now = new Date().toISOString();

      const newComplaint: Complaint = {
        id: newId,
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        locality: location.split(',')[0].trim(),
        imageDataUrl: imagePreview || undefined,
        category: analysis.category,
        priority: analysis.priority,
        department: analysis.department,
        status: 'Reported',
        aiSummary: analysis.summary,
        urgencyReason: analysis.urgencyReason,
        confidence: analysis.confidence,
        suggestedAction: analysis.suggestedAction,
        analysisSource: analysis.analysisSource,
        createdAt: now,
        updatedAt: now,
        corroborationCount: 0,
        timeline: [
          {
            id: `tl-${Date.now()}-1`,
            status: 'Reported',
            timestamp: now,
            note: `Grievance registered. ${
              analysis.analysisSource === 'Gemini'
                ? 'Gemini Multimodal AI classified category & urgency.'
                : 'Rule-based algorithmic triage completed.'
            }`,
            actor: 'CivicResolve System',
          },
          {
            id: `tl-${Date.now()}-2`,
            status: 'Reported',
            timestamp: now,
            note: `Recommended destination department: ${analysis.department}.`,
            actor: 'Automated Dispatch',
          },
        ],
      };

      await addComplaint(newComplaint);
      setSubmittedComplaint(newComplaint);
      setIsAnalyzing(false);
      setIsSuccess(true);
    } catch (err) {
      console.error('Error during AI submission:', err);
      setIsAnalyzing(false);
      alert('An error occurred while communicating with the server. Please try again.');
    }
  };

  const handleResetForm = () => {
    setTitle('');
    setDescription('');
    setLocation('');
    setCategory('Auto Detect with AI');
    setImageFile(null);
    setImagePreview(null);
    setErrors({});
    setIsSuccess(false);
    setSubmittedComplaint(null);
    setShowDuplicateBanner(false);
    setDismissDuplicate(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* SUCCESS SCREEN */}
      {isSuccess && submittedComplaint ? (
        <div className="liquid-glass-elevated rounded-3xl p-6 sm:p-10 border border-emerald-500/30 shadow-card-layered space-y-8 animate-fade-in">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(16,185,129,0.4)]">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
              {t.report.successTitle}
            </h2>
            <p className="text-sm text-lilac/80 max-w-lg mx-auto">
              {t.report.successDesc}
            </p>
          </div>

          {/* Reference ID Callout */}
          <div className="liquid-glass p-5 rounded-2xl border border-orchid/40 text-center space-y-1 bg-gradient-to-r from-plum/60 via-orchid/15 to-plum/60">
            <span className="text-xs font-mono uppercase tracking-widest text-lilac">
              Official Reference Complaint ID
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-orchid-electric tracking-wider select-all">
              {submittedComplaint.id}
            </div>
            <p className="text-[11px] text-lavender/80">
              Save or screenshot this ID to monitor municipal progress and confirm resolution.
            </p>
          </div>

          {/* AI Triage Summary Card */}
          <div className="liquid-glass p-6 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orchid-electric" />
                <h4 className="font-bold text-sm text-pearl">Gemini AI Triage Assessment</h4>
              </div>
              <span
                className={`text-xs font-mono px-2.5 py-0.5 rounded-full border ${
                  submittedComplaint.analysisSource === 'Gemini'
                    ? 'bg-orchid/20 border-orchid/40 text-orchid-electric'
                    : 'bg-amber-500/20 border-amber-500/40 text-amber-200'
                }`}
              >
                Engine: {submittedComplaint.analysisSource}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-lilac/70">Detected Category:</span>
                <p className="text-pearl font-semibold text-sm">
                  {submittedComplaint.category}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-lilac/70">Calculated Priority:</span>
                <div>
                  <PriorityBadge priority={submittedComplaint.priority} size="md" />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-lilac/70">Recommended Department:</span>
                <p className="text-pearl font-semibold text-sm flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-orchid" />
                  <span>{submittedComplaint.department}</span>
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-lilac/70">Initial Operational Status:</span>
                <div>
                  <StatusBadge status={submittedComplaint.status} size="md" />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 text-xs space-y-2">
              <div>
                <span className="text-lilac/70 font-medium">Urgency Rationale:</span>
                <p className="text-pearl mt-0.5 leading-relaxed">
                  {submittedComplaint.urgencyReason}
                </p>
              </div>
              <div>
                <span className="text-lilac/70 font-medium">Next Recommended Action:</span>
                <p className="text-orchid-electric mt-0.5 font-medium">
                  → {submittedComplaint.suggestedAction}
                </p>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate(`/track?id=${submittedComplaint.id}`)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl btn-liquid-primary font-bold text-sm flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>{t.report.trackComplaintBtn}</span>
            </button>
            <button
              onClick={handleResetForm}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl btn-liquid-secondary font-medium text-sm text-pearl hover:text-white"
            >
              {t.report.reportAnotherBtn}
            </button>
          </div>
        </div>
      ) : (
        /* REPORTING FORM */
        <div className="space-y-6">
          {/* Page Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-orchid-electric uppercase tracking-wider">
              <FileText className="w-4 h-4" />
              <span>Citizen Grievance Submission</span>
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
              {t.report.title}
            </h1>
            <p className="text-sm text-lilac/80">{t.report.subtitle}</p>
          </div>

          {/* DUPLICATE COMPLAINTS BANNER */}
          {showDuplicateBanner && detectedDuplicates.length > 0 && !dismissDuplicate && (
            <div className="liquid-glass-elevated p-5 rounded-3xl border border-orchid-electric/40 bg-gradient-to-br from-plum/90 via-mauve/80 to-orchid/20 space-y-3 animate-fade-in shadow-orchid-glow">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-orchid/30 text-orchid-electric flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      <span>{t.report.duplicateAlertTitle}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orchid/30 text-lilac">
                        {detectedDuplicates.length} Matched
                      </span>
                    </h3>
                    <p className="text-xs text-lilac/90">{t.report.duplicateAlertDesc}</p>
                  </div>
                </div>
                <button
                  onClick={() => setDismissDuplicate(true)}
                  className="p-1 rounded-lg text-lavender hover:text-white"
                  title="Dismiss duplicate alert"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Matched Complaints list */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {detectedDuplicates.slice(0, 2).map((dup) => (
                  <div
                    key={dup.id}
                    className="liquid-glass p-3 rounded-xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-orchid-electric">
                          {dup.id}
                        </span>
                        <StatusBadge status={dup.status} size="sm" showIcon={false} />
                        <PriorityBadge priority={dup.priority} size="sm" />
                      </div>
                      <p className="text-xs text-pearl font-medium line-clamp-1">
                        {dup.title}
                      </p>
                      <p className="text-[11px] text-lavender/80 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-orchid" />
                        <span>{dup.location}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        type="button"
                        onClick={() => handleSupportExisting(dup.id)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold btn-liquid-primary flex items-center gap-1.5 shadow-sm"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>{t.report.supportBtn}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-[11px] text-lavender/70">
                  Supporting an existing issue avoids duplicates and elevates municipal visibility.
                </span>
                <button
                  type="button"
                  onClick={() => setDismissDuplicate(true)}
                  className="text-xs text-lilac hover:text-white font-medium underline"
                >
                  {t.report.continueFiling}
                </button>
              </div>
            </div>
          )}

          {/* THE FORM */}
          <form onSubmit={handleSubmit} className="liquid-glass-elevated rounded-3xl p-6 sm:p-8 border border-white/15 space-y-6">
            {/* Field 1: Title */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-lilac font-semibold mb-2">
                {t.report.fieldTitle} <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t.report.fieldTitlePlaceholder}
                className="w-full liquid-glass-input rounded-2xl px-4 py-3 text-sm placeholder:text-lavender/50"
              />
              {errors.title && (
                <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.title}</span>
                </p>
              )}
            </div>

            {/* Field 2: Description */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-lilac font-semibold mb-2">
                {t.report.fieldDesc} <span className="text-red-400">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t.report.fieldDescPlaceholder}
                rows={4}
                className="w-full liquid-glass-input rounded-2xl p-4 text-sm placeholder:text-lavender/50 leading-relaxed"
              />
              {errors.description && (
                <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.description}</span>
                </p>
              )}
            </div>

            {/* Field 3: Location & Category in 2 Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Location */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-lilac font-semibold mb-2">
                  {t.report.fieldLocation} <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder={t.report.fieldLocationPlaceholder}
                    className="w-full liquid-glass-input rounded-2xl pl-10 pr-4 py-3 text-sm placeholder:text-lavender/50"
                  />
                  <MapPin className="w-4 h-4 text-orchid absolute left-3.5 top-3.5" />
                </div>
                {errors.location && (
                  <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.location}</span>
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-lilac font-semibold mb-2">
                  {t.report.fieldCategory}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full liquid-glass-input rounded-2xl px-4 py-3 text-sm text-pearl"
                >
                  <option value="Auto Detect with AI">{t.report.autoDetect}</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-lavender/70 mt-1.5">
                  Select a category or let Gemini AI analyze your description automatically.
                </p>
              </div>
            </div>

            {/* Field 5: Photo Upload (Optional) */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-lilac font-semibold mb-2">
                {t.report.fieldImage}
              </label>

              {!imagePreview ? (
                <div className="relative border-2 border-dashed border-white/15 hover:border-orchid/50 rounded-2xl p-6 text-center transition-colors bg-white/5 group">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-orchid/20 border border-orchid/30 text-orchid-electric flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Camera className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-semibold text-pearl">
                      Click or drag photo to attach visual evidence
                    </span>
                    <span className="text-xs text-lavender/70">{t.report.imageHelp}</span>
                  </div>
                </div>
              ) : (
                <div className="relative liquid-glass p-3 rounded-2xl border border-orchid/40 flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-black/40 border border-white/20 shrink-0">
                    <img
                      src={imagePreview}
                      alt="Uploaded preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="text-xs font-semibold text-pearl flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Photo Attached for Multimodal Inspection</span>
                    </div>
                    <p className="text-[11px] text-lavender/80">
                      Gemini vision engine will examine road crater, garbage volume, or visible damage.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="p-2 rounded-xl text-lavender hover:text-red-400 hover:bg-white/10 transition-colors"
                    title="Remove attached photo"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-lavender/80 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-orchid-electric" />
                <span>Backend Gemini endpoint verifies category, priority & routing.</span>
              </div>

              <button
                type="submit"
                disabled={isAnalyzing}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl btn-liquid-primary font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-orchid-glow"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t.report.submitBtn}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* INTERACTIVE AI ANALYSIS MODAL / OVERLAY */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-fade-in">
          <div className="relative w-full max-w-lg liquid-glass-elevated rounded-3xl p-8 border border-orchid/50 shadow-electric-glow text-center space-y-6 overflow-hidden">
            {/* Animated orchid scanning bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orchid-electric to-transparent animate-pulse" />

            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-orchid/20 border-2 border-orchid-electric animate-ping" />
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-orchid to-orchid-electric flex items-center justify-center shadow-orchid-glow">
                <Sparkles className="w-8 h-8 text-white animate-spin" style={{ animationDuration: '4s' }} />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-display font-bold text-xl text-white">
                Gemini Multimodal Triage in Progress
              </h3>
              <p className="text-xs text-lilac/80">
                Evaluating linguistic nuance, locality hazard level, and evidence photo...
              </p>
            </div>

            {/* Stages indicator */}
            <div className="liquid-glass p-4 rounded-2xl border border-white/10 space-y-3 text-left">
              <div className={`flex items-center gap-3 text-xs ${aiStage >= 1 ? 'text-emerald-300' : 'text-lavender/50'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${aiStage >= 1 ? 'border-emerald-400 bg-emerald-500/20' : 'border-white/10'}`}>
                  {aiStage > 1 ? '✓' : '1'}
                </div>
                <span>Parsing complaint description and visual evidence</span>
              </div>

              <div className={`flex items-center gap-3 text-xs ${aiStage >= 2 ? 'text-emerald-300' : 'text-lavender/50'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${aiStage >= 2 ? 'border-emerald-400 bg-emerald-500/20' : 'border-white/10'}`}>
                  {aiStage > 2 ? '✓' : '2'}
                </div>
                <span>Classifying civic category & public safety risk level</span>
              </div>

              <div className={`flex items-center gap-3 text-xs ${aiStage >= 3 ? 'text-emerald-300' : 'text-lavender/50'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${aiStage >= 3 ? 'border-emerald-400 bg-emerald-500/20' : 'border-white/10'}`}>
                  {aiStage > 3 ? '✓' : '3'}
                </div>
                <span>Routing to recommended municipal department dispatch</span>
              </div>

              <div className={`flex items-center gap-3 text-xs ${aiStage >= 4 ? 'text-emerald-300' : 'text-lavender/50'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${aiStage >= 4 ? 'border-emerald-400 bg-emerald-500/20' : 'border-white/10'}`}>
                  4
                </div>
                <span>Formulating urgency reasoning & confidence score</span>
              </div>
            </div>

            <p className="text-[11px] font-mono text-lavender/70">
              Backend Model: gemini-2.5-flash • Auto-fallback protection active
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

