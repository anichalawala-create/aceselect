"use client";

import { Info, BookOpen, Layers, Monitor, Building2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function UserManualPage() {
  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#283A97] mb-1 font-semibold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" /> User Manual & Documentation
          </div>
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight">How to use the Admin Panel</h1>
          <p className="text-sm text-neutral-500 mt-2">
            A step-by-step guide on managing your website's content, homepage sections, projects, and leads.
          </p>
        </div>
      </div>

      {/* Intro */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-6 flex gap-4 items-start">
        <Info className="w-6 h-6 text-blue-600 mt-0.5 shrink-0" />
        <div className="space-y-1">
          <h3 className="font-bold text-blue-900 text-lg">Welcome to the ACE SELECT Admin Portal!</h3>
          <p className="text-blue-800 text-sm leading-relaxed">
            This dashboard allows you to seamlessly update website copy, add new projects, upload media, and view incoming client leads. Select any category from the sidebar navigation to get started. All changes made in the active sections (like Hero, Projects, Products) will immediately reflect on the live website once saved.
          </p>
        </div>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 space-y-10">
        
        {/* Guide: Homepage Hero */}
        <section className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
          <div className="p-6 md:p-8 border-b border-neutral-100 flex items-center gap-3 bg-neutral-50/50">
            <div className="w-10 h-10 rounded-xl bg-[#283A97]/10 flex items-center justify-center">
              <Layers className="w-5 h-5 text-[#283A97]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900">1. Editing the Homepage Hero & Video</h2>
              <p className="text-sm text-neutral-500">Update main headlines, buttons, and the background video.</p>
            </div>
          </div>
          <div className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4 text-sm text-neutral-700 leading-relaxed">
                <p>
                  Navigate to <strong>Homepage &gt; Hero Section</strong> from the left sidebar. This is where you can change the main welcoming text of your website.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Headline & Text:</strong> Edit the primary and secondary headline texts to announce new campaigns.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Call-to-Action Buttons:</strong> Change the labels and destination links for the two primary buttons.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Background Video:</strong> To change the video that plays in the background, locate the "Background Media" section. You can type in the URL or file path of the new video, or use the "Upload File" button. (e.g. <code className="bg-neutral-100 px-1 py-0.5 rounded text-[#283A97]">/videos/new-hero.mp4</code>)</span>
                  </li>
                </ul>
              </div>
              <div className="bg-neutral-100 rounded-xl p-4 border border-neutral-200 relative">
                {/* Mockup Placeholder */}
                <div className="aspect-video bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
                  <div className="h-6 bg-neutral-100 border-b border-neutral-200 flex items-center px-2 gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div className="p-4 flex-1 flex flex-col gap-3">
                    <div className="w-1/3 h-2 bg-neutral-200 rounded-full" />
                    <div className="w-2/3 h-4 bg-[#283A97]/20 rounded-full" />
                    <div className="w-1/2 h-4 bg-[#283A97]/20 rounded-full" />
                    <div className="mt-auto space-y-2">
                       <div className="w-full h-8 bg-neutral-50 border border-neutral-200 rounded flex items-center px-2">
                         <span className="text-[8px] text-neutral-400">Background Video URL</span>
                       </div>
                    </div>
                  </div>
                </div>
                <p className="text-center text-[10px] text-neutral-400 mt-2 font-medium uppercase tracking-wider">Fig 1: Hero Section Editor</p>
              </div>
            </div>
          </div>
        </section>

        {/* Guide: Company Section */}
        <section className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
          <div className="p-6 md:p-8 border-b border-neutral-100 flex items-center gap-3 bg-neutral-50/50">
            <div className="w-10 h-10 rounded-xl bg-[#283A97]/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[#283A97]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900">2. Managing Company Details & Background Video</h2>
              <p className="text-sm text-neutral-500">Update corporate vision, mission, and the company page background video.</p>
            </div>
          </div>
          <div className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="bg-neutral-100 rounded-xl p-4 border border-neutral-200 relative order-2 md:order-1">
                {/* Mockup Placeholder */}
                <div className="aspect-video bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
                  <div className="h-6 bg-neutral-100 border-b border-neutral-200 flex items-center px-2 gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div className="p-4 flex-1 flex flex-col gap-3">
                     <div className="w-full h-10 bg-neutral-50 border border-neutral-200 rounded flex flex-col justify-center px-2 py-1">
                         <span className="text-[6px] text-neutral-400 font-bold">CORPORATE MISSION</span>
                         <span className="text-[8px] text-neutral-700">Delivering turnkey Design-to-Build...</span>
                     </div>
                     <div className="w-full h-10 bg-neutral-50 border border-neutral-200 rounded flex flex-col justify-center px-2 py-1">
                         <span className="text-[6px] text-neutral-400 font-bold">BACKGROUND VIDEO URL</span>
                         <span className="text-[8px] text-neutral-700">/videos/company-overview.mp4</span>
                     </div>
                  </div>
                </div>
                <p className="text-center text-[10px] text-neutral-400 mt-2 font-medium uppercase tracking-wider">Fig 2: Company Overview Editor</p>
              </div>

              <div className="space-y-4 text-sm text-neutral-700 leading-relaxed order-1 md:order-2">
                <p>
                  Navigate to <strong>Company &gt; Company Page</strong> from the left sidebar to access the settings for the "Who We Are" page.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Vision & Mission:</strong> Keep your corporate identity up to date by modifying the text blocks. Ensure the text remains concise and impactful.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Background Video:</strong> Provide a new video path in the "Background Video URL" field to change the visual backdrop of the company section. The "Upload File" button allows you to directly place new media into your library.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Guide: Managing Projects */}
        <section className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
          <div className="p-6 md:p-8 border-b border-neutral-100 flex items-center gap-3 bg-neutral-50/50">
            <div className="w-10 h-10 rounded-xl bg-[#283A97]/10 flex items-center justify-center">
              <Monitor className="w-5 h-5 text-[#283A97]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900">3. Adding & Managing Projects</h2>
              <p className="text-sm text-neutral-500">How to showcase new installations to your clients.</p>
            </div>
          </div>
          <div className="p-6 md:p-8 space-y-6">
            <p className="text-sm text-neutral-700">
              The <strong>Projects</strong> tab allows you to create new portfolio items. When adding a new project, you will be prompted for:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
               <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-xl">
                 <h4 className="font-bold text-neutral-900 text-sm mb-1">Details</h4>
                 <p className="text-xs text-neutral-500">Provide Title, Client Name, Location, and Industry Category.</p>
               </div>
               <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-xl">
                 <h4 className="font-bold text-neutral-900 text-sm mb-1">Images</h4>
                 <p className="text-xs text-neutral-500">Upload high-resolution images of the installation site.</p>
               </div>
               <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-xl">
                 <h4 className="font-bold text-neutral-900 text-sm mb-1">Statistics</h4>
                 <p className="text-xs text-neutral-500">Add key metrics like screen size (sqm), pixel pitch, and deployment duration.</p>
               </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
