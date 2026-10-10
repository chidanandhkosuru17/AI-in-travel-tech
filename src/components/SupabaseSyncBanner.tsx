import React, { useState } from 'react';
import { Database, ShieldCheck, Check, Copy, ExternalLink, Code2, Sparkles } from 'lucide-react';
import { SUPABASE_CONFIG, SUPABASE_SQL_SCHEMA } from '../lib/supabase';

export const SupabaseSyncBanner: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [showSqlModal, setShowSqlModal] = useState(false);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="bg-white rounded-3xl border border-[#E4E7EC] shadow-md p-6 sm:p-7 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF0FF] text-[#0057FF] flex items-center justify-center shrink-0 shadow-sm border border-[#0057FF]/20">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-[#101828]">
                  Supabase Cloud Database & Authentication
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-50 text-[#15803D] border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#15803D] animate-pulse" />
                  <span>Connected: {SUPABASE_CONFIG.projectName}</span>
                </span>
              </div>
              <p className="text-xs text-[#667085] mt-1 max-w-2xl leading-relaxed">
                Project ID: <span className="font-mono font-semibold text-[#101828]">{SUPABASE_CONFIG.projectId}</span>. Authentication, user-liked & saved trips (<code className="text-[#0057FF] font-mono">saved_trips</code>), multimodal booking reservations, support inquiries, and trusted safety contacts are synchronized with your Supabase PostgreSQL cluster.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowSqlModal(true)}
              className="px-4 py-2.5 rounded-xl border border-[#E4E7EC] bg-[#F8F7F4] hover:bg-[#EAF0FF] text-xs font-semibold text-[#101828] flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Code2 className="w-4 h-4 text-[#0057FF]" />
              <span>View SQL Schema</span>
            </button>
            <a
              href={`https://supabase.com/dashboard/project/${SUPABASE_CONFIG.projectId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#0057FF] hover:bg-[#0045CC] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#0057FF]/20 transition-all cursor-pointer"
            >
              <span>Supabase Console</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* SQL Schema Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E4E7EC] p-6 sm:p-8 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-[#E4E7EC]">
              <div className="flex items-center gap-2.5">
                <Database className="w-5 h-5 text-[#0057FF]" />
                <h4 className="text-base font-bold text-[#101828]">
                  TRAVELTECHAI Database Schema (PostgreSQL)
                </h4>
              </div>
              <button
                onClick={() => setShowSqlModal(false)}
                className="text-xs font-semibold text-[#667085] hover:text-[#101828] cursor-pointer"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-[#667085] my-3">
              To create the <code className="bg-[#F8F7F4] px-1.5 py-0.5 rounded font-mono text-[#0057FF]">saved_trips</code>, <code className="bg-[#F8F7F4] px-1.5 py-0.5 rounded font-mono text-[#0057FF]">inquiries</code>, <code className="bg-[#F8F7F4] px-1.5 py-0.5 rounded font-mono text-[#0057FF]">bookings</code> and <code className="bg-[#F8F7F4] px-1.5 py-0.5 rounded font-mono text-[#0057FF]">trusted_contacts</code> tables in your project, paste this SQL snippet into your{' '}
              <a
                href={`https://supabase.com/dashboard/project/${SUPABASE_CONFIG.projectId}/sql`}
                target="_blank"
                rel="noreferrer"
                className="text-[#0057FF] font-semibold underline"
              >
                Supabase SQL Editor
              </a>.
            </p>

            <div className="flex-1 bg-[#101828] rounded-2xl p-4 overflow-y-auto font-mono text-xs text-gray-200">
              <pre className="whitespace-pre-wrap">{SUPABASE_SQL_SCHEMA}</pre>
            </div>

            <div className="pt-4 mt-4 border-t border-[#E4E7EC] flex items-center justify-between">
              <span className="text-[11px] text-[#667085]">Project: {SUPABASE_CONFIG.projectId}</span>
              <button
                onClick={handleCopySql}
                className="px-5 py-2.5 rounded-xl bg-[#0057FF] hover:bg-[#0045CC] text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-[#0057FF]/25"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy SQL Schema'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
