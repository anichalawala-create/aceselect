"use client";

import { useState, useEffect } from "react";
import { Building2, Save, CheckCircle2, RefreshCw } from "lucide-react";
import { generateVideoThumbnail } from "@/lib/videoUtils";

export default function AdminCompanyPage() {
  const [vision, setVision] = useState("To engineer transformative visual experiences that elevate India's commercial and public landscapes.");
  const [mission, setMission] = useState("Delivering turnkey Design-to-Build display systems and advertising infrastructure with unmatched precision, speed, and reliability.");
  const [videoUrl, setVideoUrl] = useState("/videos/company-bg.mp4");
  const [posterUrl, setPosterUrl] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function loadCompany() {
      try {
        const res = await fetch("/api/admin/content?section=company");
        const json = await res.json();
        if (json.success && json.data) {
          if (json.data.vision) setVision(json.data.vision);
          if (json.data.mission) setMission(json.data.mission);
          if (json.data.videoUrl) setVideoUrl(json.data.videoUrl);
          if (json.data.posterUrl) setPosterUrl(json.data.posterUrl);
        }
      } catch (err) {
        console.error("Failed to load company content:", err);
      }
    }
    loadCompany();
  }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("files", file);
    
    if (file.type.startsWith("video/")) {
      try {
        const thumbnail = await generateVideoThumbnail(file);
        formData.append("files", thumbnail);
      } catch (err) {
        console.error("Failed to generate thumbnail:", err);
      }
    }
    
    formData.append("folder", "company");

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (data.success && data.files?.length > 0) {
        const uploadedVideo = data.files.find((f: any) => f.type === "video");
        const uploadedImage = data.files.find((f: any) => f.type === "image");
        
        if (uploadedVideo) {
          setVideoUrl(uploadedVideo.url);
        } else if (data.url && !uploadedVideo) {
          setVideoUrl(data.url);
        }

        if (uploadedImage) {
          setPosterUrl(uploadedImage.url);
        }
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err) {
      alert("An error occurred during upload.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "company",
          data: { vision, mission, videoUrl, posterUrl },
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to save company details");
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert("Error saving company details: " + (err.message || String(err)));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Company Overview & Heritage</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Corporate narrative, founding history, and institutional vision showcased on the Who We Are page
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#283A97] text-white text-sm font-semibold rounded-lg hover:bg-[#1e2d7a] transition-colors cursor-pointer shadow-xs disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saved ? "Saved ✓" : saving ? "Saving..." : "Save Overview"}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-5">
        <div>
          <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
            Corporate Vision
          </label>
          <textarea
            rows={3}
            value={vision}
            onChange={(e) => setVision(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97] resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
            Corporate Mission
          </label>
          <textarea
            rows={3}
            value={mission}
            onChange={(e) => setMission(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97] resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
            Background Video
          </label>
          <div className="space-y-3">
            {videoUrl && (
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="flex items-center gap-2 truncate pr-4">
                  <div className="w-8 h-8 bg-[#283A97]/10 rounded flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-[#283A97]" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-blue-900">Current Video</p>
                    <p className="text-xs text-blue-700 truncate">{videoUrl.split('/').pop() || videoUrl}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="relative group">
              <input 
                type="file" 
                accept="video/*,image/*"
                onChange={handleUpload}
                disabled={uploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10" 
                title="Upload new video"
              />
              <div className={`w-full flex flex-col items-center justify-center py-6 px-4 border-2 border-dashed rounded-xl transition-colors ${uploading ? 'bg-neutral-50 border-neutral-200' : 'bg-neutral-50/50 border-neutral-300 group-hover:bg-blue-50 group-hover:border-[#283A97]/40'}`}>
                {uploading ? (
                  <div className="flex flex-col items-center gap-2 text-neutral-500">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span className="text-sm font-medium">Uploading video...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-neutral-600">
                    <div className="w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center border border-neutral-200 mb-1 group-hover:text-[#283A97] group-hover:border-[#283A97]/30 transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    </div>
                    <span className="text-sm font-semibold">Click to upload new video</span>
                    <span className="text-xs text-neutral-400">Supports MP4, WebM</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
