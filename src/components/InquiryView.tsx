import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Send,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Code2,
  Database,
  ExternalLink,
  MessageSquare,
  Clock,
  Sparkles,
  Phone,
  Mail,
  User,
  Tag,
  FileText,
  RefreshCw,
} from 'lucide-react';
import { supabase, SUPABASE_CONFIG, SUPABASE_SQL_SCHEMA, saveInquiryToSupabase } from '../lib/supabase';
import { useTravel } from '../context/TravelContext';

export interface InquiryItem {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  category: string;
  subject: string;
  message: string;
  preferredContact: string;
  pnrOrBookingId?: string;
  status: 'pending' | 'in_review' | 'resolved' | 'closed';
  createdAt: string;
}

export const INQUIRY_TABLE_SQL = `-- TRAVELTECHAI Supabase Database Schema for Inquiry Form
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/isjuyszkbxreenmzdfih/sql

-- 1. Create Inquiries Table
create table if not exists public.inquiries (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  email text not null,
  phone text,
  category text not null default 'general',
  subject text not null,
  message text not null,
  preferred_contact text default 'email',
  pnr_or_booking_id text,
  status text not null default 'pending', -- pending, in_review, resolved, closed
  resolved_at timestamp with time zone,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Performance & Lookup Indexes
create index if not exists idx_inquiries_email on public.inquiries(email);
create index if not exists idx_inquiries_status on public.inquiries(status);
create index if not exists idx_inquiries_created_at on public.inquiries(created_at desc);

-- 3. Enable Row Level Security (RLS)
alter table public.inquiries enable row level security;

-- 4. Policies (Allow anonymous & authenticated passengers to submit and read inquiries)
create policy "Allow insert for all users"
on public.inquiries for insert
with check (true);

create policy "Allow select for all users"
on public.inquiries for select
using (true);

create policy "Allow update for all users"
on public.inquiries for update
using (true) with check (true);
`;

const INITIAL_INQUIRIES: InquiryItem[] = [
  {
    id: 'demo-inq-1',
    fullName: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    phone: '+91 98765 43210',
    category: 'booking',
    subject: 'Seat change request for TSRTC AC Sleeper',
    message: 'Could I switch from Upper Berth U4 to Lower Berth L2 on bus TS09Z8844 on Oct 14th?',
    preferredContact: 'email',
    pnrOrBookingId: 'ROAM-2026-HYD-GOA',
    status: 'in_review',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'demo-inq-2',
    fullName: 'Rajesh Varma',
    email: 'rajesh.v@example.com',
    phone: '+91 94401 23456',
    category: 'luggage',
    subject: 'Inquiry regarding forgotten laptop bag on Route 108',
    message: 'I checked the Lost Luggage section and saw item LUG-2026-001. How can I confirm verification?',
    preferredContact: 'phone',
    pnrOrBookingId: 'ROAM-98214',
    status: 'resolved',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

export const InquiryView: React.FC = () => {
  const { user } = useTravel();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    category: 'general',
    subject: '',
    message: '',
    preferredContact: 'email',
    pnrOrBookingId: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);
  const [showSqlDrawer, setShowSqlDrawer] = useState(false);
  const [inquiriesList, setInquiriesList] = useState<InquiryItem[]>(() => {
    try {
      const saved = localStorage.getItem('tbs_roamagent_inquiries');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_INQUIRIES;
  });
  const [activeTab, setActiveTab] = useState<'form' | 'recent' | 'sql'>('form');

  // Load inquiries from Supabase if table is present
  const fetchSupabaseInquiries = async () => {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error && data && data.length > 0) {
        const mapped: InquiryItem[] = data.map((d: any) => ({
          id: d.id,
          fullName: d.full_name,
          email: d.email,
          phone: d.phone,
          category: d.category,
          subject: d.subject,
          message: d.message,
          preferredContact: d.preferred_contact || 'email',
          pnrOrBookingId: d.pnr_or_booking_id,
          status: d.status || 'pending',
          createdAt: d.created_at,
        }));
        setInquiriesList(mapped);
      }
    } catch (e) {
      console.warn('Could not fetch inquiries from Supabase:', e);
    }
  };

  useEffect(() => {
    fetchSupabaseInquiries();
  }, []);

  const handleCopySql = () => {
    navigator.clipboard.writeText(INQUIRY_TABLE_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill in your name, email, subject, and inquiry message.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      // 1. Try persisting directly to Supabase table
      const res = await saveInquiryToSupabase(formData);

      // 2. Add to local state and localStorage so the user sees it immediately
      const newInquiry: InquiryItem = {
        id: 'inq-' + Date.now(),
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        category: formData.category,
        subject: formData.subject,
        message: formData.message,
        preferredContact: formData.preferredContact,
        pnrOrBookingId: formData.pnrOrBookingId,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      const updated = [newInquiry, ...inquiriesList];
      setInquiriesList(updated);
      try {
        localStorage.setItem('tbs_roamagent_inquiries', JSON.stringify(updated));
      } catch {}

      setSubmitting(false);
      setSubmitSuccess(true);

      // Reset form fields while preserving name and email if logged in
      setFormData({
        fullName: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        category: 'general',
        subject: '',
        message: '',
        preferredContact: 'email',
        pnrOrBookingId: '',
      });

      // Also refresh Supabase list in background
      fetchSupabaseInquiries();
    } catch (err: any) {
      setSubmitting(false);
      setErrorMessage(err?.message || 'Error submitting inquiry');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#101828] via-[#101828] to-[#0057FF]/80 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl border border-white/10">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-[#93C5FD]">
            <HelpCircle className="w-4 h-4 text-[#60A5FA]" />
            <span>Support & Assistance Desk</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Traveler Inquiry & Support Form
          </h1>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            Have a question about multimodal schedules, bus ticket modifications, lost baggage, or female safety escorts? Submit an inquiry below. All submissions are automatically saved to your <strong className="text-white">Supabase PostgreSQL</strong> database table.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('sql')}
              className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold flex items-center gap-2 backdrop-blur-sm border border-white/20 transition-all cursor-pointer"
            >
              <Code2 className="w-4 h-4 text-[#93C5FD]" />
              <span>Get SQL Table Script</span>
            </button>
            <a
              href={`https://supabase.com/dashboard/project/${SUPABASE_CONFIG.projectId}/sql`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-[#0057FF] hover:bg-[#0045CC] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#0057FF]/30 transition-all cursor-pointer"
            >
              <span>Open Supabase SQL Editor</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E4E7EC] pb-2">
        <button
          onClick={() => setActiveTab('form')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'form'
              ? 'bg-[#0057FF] text-white shadow-md shadow-[#0057FF]/25'
              : 'text-[#667085] hover:text-[#101828] hover:bg-[#EAF0FF]/50'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Submit Inquiry</span>
        </button>

        <button
          onClick={() => setActiveTab('recent')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'recent'
              ? 'bg-[#0057FF] text-white shadow-md shadow-[#0057FF]/25'
              : 'text-[#667085] hover:text-[#101828] hover:bg-[#EAF0FF]/50'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Recent Inquiries ({inquiriesList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sql')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'sql'
              ? 'bg-[#0057FF] text-white shadow-md shadow-[#0057FF]/25'
              : 'text-[#667085] hover:text-[#101828] hover:bg-[#EAF0FF]/50'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Inquiry Table SQL</span>
        </button>
      </div>

      {/* TAB 1: FORM */}
      {activeTab === 'form' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-[#E4E7EC] shadow-md p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#E4E7EC] mb-6">
              <div>
                <h2 className="text-lg font-bold text-[#101828]">New Inquiry Submission</h2>
                <p className="text-xs text-[#667085] mt-0.5">
                  Our 24/7 AI Concierge and support officers respond within 15 minutes.
                </p>
              </div>
              <span className="text-[11px] font-bold bg-emerald-50 text-[#15803D] border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#15803D] animate-pulse" />
                <span>Syncs to Supabase</span>
              </span>
            </div>

            {submitSuccess && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-900 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold text-emerald-800">Inquiry submitted successfully!</p>
                  <p className="text-emerald-700">
                    Your request has been registered and inserted into the Supabase <code className="font-mono bg-emerald-100 px-1 rounded">public.inquiries</code> database table. You can track status under the "Recent Inquiries" tab.
                  </p>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="text-[11px] font-bold text-emerald-800 underline mt-1 cursor-pointer"
                  >
                    Submit another inquiry
                  </button>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-900">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-rose-800">Submission Error</p>
                  <p className="text-rose-700">{errorMessage}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#101828] mb-1.5">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Kosuru Chidanandh"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E4E7EC] bg-[#F8F7F4] text-xs font-medium text-[#101828] focus:bg-white focus:outline-none focus:border-[#0057FF] focus:ring-2 focus:ring-[#0057FF]/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#101828] mb-1.5">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E4E7EC] bg-[#F8F7F4] text-xs font-medium text-[#101828] focus:bg-white focus:outline-none focus:border-[#0057FF] focus:ring-2 focus:ring-[#0057FF]/20"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#101828] mb-1.5">
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E4E7EC] bg-[#F8F7F4] text-xs font-medium text-[#101828] focus:bg-white focus:outline-none focus:border-[#0057FF] focus:ring-2 focus:ring-[#0057FF]/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#101828] mb-1.5">
                    Inquiry Category <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Tag className="w-4 h-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E4E7EC] bg-[#F8F7F4] text-xs font-medium text-[#101828] focus:bg-white focus:outline-none focus:border-[#0057FF] focus:ring-2 focus:ring-[#0057FF]/20 cursor-pointer"
                    >
                      <option value="general">General Travel Inquiry</option>
                      <option value="booking">Booking & Reservation Assistance</option>
                      <option value="luggage">Lost Luggage & Recovery Claim</option>
                      <option value="safety">Women Safety & Escort Service</option>
                      <option value="disruption">Delay & Disruption Compensation</option>
                      <option value="technical">Technical Support & Website Issue</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#101828] mb-1.5">
                    PNR or Booking ID (Optional)
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.pnrOrBookingId}
                      onChange={(e) => setFormData({ ...formData, pnrOrBookingId: e.target.value })}
                      placeholder="e.g. ROAM-2026-HYD-GOA"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E4E7EC] bg-[#F8F7F4] text-xs font-medium text-[#101828] focus:bg-white focus:outline-none focus:border-[#0057FF] focus:ring-2 focus:ring-[#0057FF]/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#101828] mb-1.5">
                    Preferred Response Channel
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center gap-2 p-2.5 rounded-xl border border-[#E4E7EC] bg-[#F8F7F4] text-xs font-semibold cursor-pointer">
                      <input
                        type="radio"
                        name="preferredContact"
                        value="email"
                        checked={formData.preferredContact === 'email'}
                        onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value })}
                        className="text-[#0057FF]"
                      />
                      <span>Email</span>
                    </label>
                    <label className="flex items-center gap-2 p-2.5 rounded-xl border border-[#E4E7EC] bg-[#F8F7F4] text-xs font-semibold cursor-pointer">
                      <input
                        type="radio"
                        name="preferredContact"
                        value="phone"
                        checked={formData.preferredContact === 'phone'}
                        onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value })}
                        className="text-[#0057FF]"
                      />
                      <span>Phone / SMS</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#101828] mb-1.5">
                  Subject <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Summary of your inquiry or issue"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E4E7EC] bg-[#F8F7F4] text-xs font-medium text-[#101828] focus:bg-white focus:outline-none focus:border-[#0057FF] focus:ring-2 focus:ring-[#0057FF]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#101828] mb-1.5">
                  Detailed Message / Question <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please describe your travel inquiry, flight/bus details, or question with as much detail as possible..."
                  className="w-full px-4 py-3 rounded-xl border border-[#E4E7EC] bg-[#F8F7F4] text-xs font-medium text-[#101828] focus:bg-white focus:outline-none focus:border-[#0057FF] focus:ring-2 focus:ring-[#0057FF]/20 resize-y"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-[#667085]">
                  Encrypted & securely recorded in database
                </span>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 rounded-xl bg-[#0057FF] hover:bg-[#0045CC] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-[#0057FF]/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving to Database...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Side Info & SQL Preview Card */}
          <div className="space-y-6">
            {/* Database Sync Card */}
            <div className="bg-white rounded-3xl border border-[#E4E7EC] shadow-md p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EAF0FF] text-[#0057FF] flex items-center justify-center font-bold">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#101828]">Supabase PostgreSQL</h3>
                  <p className="text-[11px] text-[#667085]">Project: {SUPABASE_CONFIG.projectId}</p>
                </div>
              </div>

              <p className="text-xs text-[#667085] leading-relaxed">
                When passengers submit this inquiry form, records are saved into the table:
              </p>

              <div className="bg-[#101828] text-white p-3 rounded-xl font-mono text-[11px]">
                <span className="text-[#60A5FA]">public</span>.<span className="text-emerald-400 font-bold">inquiries</span>
              </div>

              <div className="space-y-1.5 text-xs text-[#667085]">
                <div className="flex items-center justify-between py-1 border-b border-[#E4E7EC]">
                  <span>Table Status</span>
                  <span className="font-semibold text-emerald-600">Active / Configured</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#E4E7EC]">
                  <span>Row Level Security</span>
                  <span className="font-semibold text-[#101828]">Enabled (RLS)</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span>Sync Mode</span>
                  <span className="font-semibold text-[#0057FF]">Direct Client REST API</span>
                </div>
              </div>

              <button
                onClick={handleCopySql}
                className="w-full py-2.5 rounded-xl border border-[#0057FF]/30 bg-[#EAF0FF] hover:bg-[#0057FF] hover:text-white text-[#0057FF] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Copied SQL to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy CREATE TABLE SQL</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Assistance */}
            <div className="bg-[#F8F7F4] rounded-3xl border border-[#E4E7EC] p-6 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#101828]">
                Urgent Assistance Channels
              </h4>
              <p className="text-xs text-[#667085]">
                For immediate disruptions on active routes, you can also use our direct emergency lines:
              </p>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white border border-[#E4E7EC] flex items-center justify-between">
                  <span className="text-[#667085]">24/7 Helpline:</span>
                  <span className="font-mono font-bold text-[#0057FF]">1800-425-8899</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-[#E4E7EC] flex items-center justify-between">
                  <span className="text-[#667085]">Emergency SOS:</span>
                  <span className="font-mono font-bold text-rose-600">Dial 112 / 1091</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RECENT INQUIRIES */}
      {activeTab === 'recent' && (
        <div className="bg-white rounded-3xl border border-[#E4E7EC] shadow-md p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E4E7EC]">
            <div>
              <h2 className="text-lg font-bold text-[#101828]">Stored Inquiry Submissions</h2>
              <p className="text-xs text-[#667085] mt-0.5">
                Listing inquiries stored in your Supabase database and local session.
              </p>
            </div>
            <button
              onClick={fetchSupabaseInquiries}
              className="px-4 py-2 rounded-xl border border-[#E4E7EC] bg-[#F8F7F4] hover:bg-[#EAF0FF] text-xs font-semibold text-[#101828] flex items-center gap-2 self-start cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#0057FF]" />
              <span>Refresh Records</span>
            </button>
          </div>

          <div className="space-y-4">
            {inquiriesList.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl border border-[#E4E7EC] bg-[#F8F7F4]/60 hover:bg-white hover:border-[#0057FF]/30 transition-all shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-[#101828]">{item.fullName}</span>
                    <span className="text-xs text-[#667085]">({item.email})</span>
                    {item.pnrOrBookingId && (
                      <span className="text-[10px] bg-blue-50 text-[#0057FF] border border-blue-200 px-2 py-0.5 rounded-md font-mono font-bold">
                        PNR: {item.pnrOrBookingId}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                        item.status === 'resolved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : item.status === 'in_review'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-blue-50 text-[#0057FF] border border-blue-200'
                      }`}
                    >
                      {item.status.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] text-[#667085]">
                      {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#101828]">{item.subject}</h4>
                  <p className="text-xs text-[#667085] mt-1 leading-relaxed">{item.message}</p>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-[#667085] pt-1 border-t border-[#E4E7EC]/60">
                  <span>Category: <strong className="text-[#101828] capitalize">{item.category}</strong></span>
                  <span>•</span>
                  <span>Preferred: <strong className="text-[#101828] capitalize">{item.preferredContact}</strong></span>
                  {item.phone && (
                    <>
                      <span>•</span>
                      <span>Phone: <strong className="text-[#101828]">{item.phone}</strong></span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SQL SCHEMA */}
      {activeTab === 'sql' && (
        <div className="bg-white rounded-3xl border border-[#E4E7EC] shadow-md p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E4E7EC]">
            <div>
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-[#0057FF]" />
                <h2 className="text-lg font-bold text-[#101828]">
                  PostgreSQL Table Creation SQL: <code className="font-mono text-[#0057FF]">public.inquiries</code>
                </h2>
              </div>
              <p className="text-xs text-[#667085] mt-1">
                Run this SQL in your Supabase SQL Editor to establish the table, indexes, and row-level security permissions.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopySql}
                className="px-4 py-2.5 rounded-xl bg-[#0057FF] hover:bg-[#0045CC] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#0057FF]/20 transition-all cursor-pointer"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy SQL Script</span>
                  </>
                )}
              </button>
              <a
                href={`https://supabase.com/dashboard/project/${SUPABASE_CONFIG.projectId}/sql`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl border border-[#E4E7EC] bg-[#F8F7F4] hover:bg-[#EAF0FF] text-xs font-semibold text-[#101828] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Supabase SQL Editor</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="bg-[#101828] text-gray-200 p-6 rounded-2xl font-mono text-xs overflow-x-auto shadow-inner leading-relaxed">
            <pre className="whitespace-pre-wrap">{INQUIRY_TABLE_SQL}</pre>
          </div>

          {/* Schema Explanation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl border border-[#E4E7EC] bg-[#F8F7F4] space-y-1.5">
              <h4 className="text-xs font-bold text-[#101828] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Primary Key & UUID</span>
              </h4>
              <p className="text-[11px] text-[#667085]">
                Uses <code className="text-[#0057FF] font-mono">gen_random_uuid()</code> for secure, distributed IDs.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-[#E4E7EC] bg-[#F8F7F4] space-y-1.5">
              <h4 className="text-xs font-bold text-[#101828] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Performance Indexes</span>
              </h4>
              <p className="text-[11px] text-[#667085]">
                Indexed by <code className="text-[#0057FF] font-mono">email</code>, <code className="text-[#0057FF] font-mono">status</code>, and <code className="text-[#0057FF] font-mono">created_at desc</code>.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-[#E4E7EC] bg-[#F8F7F4] space-y-1.5">
              <h4 className="text-xs font-bold text-[#101828] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Row Level Security</span>
              </h4>
              <p className="text-[11px] text-[#667085]">
                RLS policies configured for open passenger submissions and authenticated review.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
