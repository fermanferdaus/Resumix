import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "../../components/layout/Navbar.jsx";
import { useAuthStore } from "../../store/authStore.js";
import {
  useResumeDetailQuery,
  useUpdateResumeMutation,
} from "../../hooks/useResumeQueries.js";
import { resumeApi } from "../../api/resumeApi.js";
import { EditorSubheader } from "../../components/editor/EditorSubheader.jsx";
import { EditorSidebar } from "../../components/editor/EditorSidebar.jsx";
import { EditorSectionForm } from "../../components/editor/EditorSectionForm.jsx";
import { EditorSkeleton } from "../../components/editor/EditorSkeleton.jsx";
import { ResumeA4Preview } from "../../components/editor/ResumeA4Preview.jsx";
import { calculateAtsProgress } from "../../lib/resumeScore.js";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button.jsx";

export const EditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const {
    data: resumeDetail,
    isLoading: isDetailLoading,
    isError: isDetailError,
  } = useResumeDetailQuery(id);

  const updateResumeMutation = useUpdateResumeMutation();

  // Local Editor State
  const [activeSection, setActiveSection] = useState("header");
  const [title, setTitle] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [formData, setFormData] = useState({
    header: {},
    summary: "",
    educations: [],
    experiences: [],
    organizations: [],
    certifications: [],
    skills: { hardSkills: [], softSkills: [] },
  });

  // Debounced preview state
  const [debouncedPreviewData, setDebouncedPreviewData] = useState(formData);
  const [saveStatus, setSaveStatus] = useState("saved"); // "saved" | "saving" | "error"
  const [zoom, setZoom] = useState(100);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(true);

  const previewRef = useRef(null);
  const isInitialLoadedRef = useRef(false);
  const saveTimeoutRef = useRef(null);
  const previewTimeoutRef = useRef(null);
  const isDirtyRef = useRef(false);
  const latestDataRef = useRef({ title, targetRole, formData });

  useEffect(() => {
    latestDataRef.current = {
      title,
      targetRole: formData.header?.targetRole || targetRole,
      formData,
    };
  }, [title, targetRole, formData]);

  // Sync data from backend query on load
  useEffect(() => {
    if (resumeDetail?.data && !isInitialLoadedRef.current) {
      const resume = resumeDetail.data;
      setTitle(resume.title || "Resume Tanpa Judul");
      setTargetRole(resume.targetRole || "");

      const rawData =
        resume.data && typeof resume.data === "object" ? resume.data : {};

      // Auto-fill nama dan email dari user jika kosong
      const rawLinks = Array.isArray(rawData.header?.links) && rawData.header.links.length > 0
        ? rawData.header.links
        : rawData.header?.website
        ? [rawData.header.website]
        : [""];

      const initialHeader = {
        fullName: rawData.header?.fullName || user?.fullName || "",
        targetRole: rawData.header?.targetRole || resume.targetRole || "",
        email: rawData.header?.email || user?.email || "",
        phone: rawData.header?.phone || "",
        website: rawData.header?.website || (rawLinks[0] || ""),
        links: rawLinks,
        location: rawData.header?.location || "",
      };

      const initialData = {
        header: initialHeader,
        summary: rawData.summary || "",
        educations: Array.isArray(rawData.educations) ? rawData.educations : [],
        experiences: Array.isArray(rawData.experiences) ? rawData.experiences : [],
        organizations: Array.isArray(rawData.organizations)
          ? rawData.organizations
          : [],
        certifications: Array.isArray(rawData.certifications)
          ? rawData.certifications
          : [],
        skills: {
          hardSkills: Array.isArray(rawData.skills?.hardSkills)
            ? rawData.skills.hardSkills
            : [],
          softSkills: Array.isArray(rawData.skills?.softSkills)
            ? rawData.skills.softSkills
            : [],
        },
      };

      setFormData(initialData);
      setDebouncedPreviewData(initialData);
      isInitialLoadedRef.current = true;
    }
  }, [resumeDetail, user]);

  // Flush pending save on unmount
  useEffect(() => {
    return () => {
      if (isDirtyRef.current && id) {
        const latest = latestDataRef.current;
        resumeApi
          .updateResume(id, {
            title: latest.title || "Resume Tanpa Judul",
            targetRole: latest.targetRole || null,
            data: latest.formData,
          })
          .catch((err) => console.error("Gagal menyimpan saat keluar", err));
      }
    };
  }, [id]);

  // Debounced Auto-Save to Backend
  const triggerAutoSave = useCallback(
    (newTitle, newTargetRole, newFormData) => {
      isDirtyRef.current = true;
      setSaveStatus("saving");
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(async () => {
        try {
          await updateResumeMutation.mutateAsync({
            id,
            data: {
              title: newTitle || "Resume Tanpa Judul",
              targetRole: newTargetRole || newFormData.header?.targetRole || null,
              data: newFormData,
            },
          });
          isDirtyRef.current = false;
          setSaveStatus("saved");
        } catch (error) {
          console.error("Gagal melakukan autosave", error);
          setSaveStatus("error");
        }
      }, 800);
    },
    [id, updateResumeMutation]
  );

  // Debounced Live Preview Update
  const triggerPreviewUpdate = useCallback((newFormData) => {
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
    }
    previewTimeoutRef.current = setTimeout(() => {
      setDebouncedPreviewData(newFormData);
    }, 150);
  }, []);

  // Form Change Handler
  const handleFormChange = (newFormData) => {
    setFormData(newFormData);
    triggerPreviewUpdate(newFormData);
    triggerAutoSave(
      title,
      newFormData.header?.targetRole || targetRole,
      newFormData
    );
  };

  // Title Change Handler
  const handleTitleChange = (newTitle) => {
    setTitle(newTitle);
    triggerAutoSave(
      newTitle,
      formData.header?.targetRole || targetRole,
      formData
    );
  };

  // Calculate Completeness Progress (0 - 100%)
  const progress = useMemo(() => {
    return calculateAtsProgress(formData);
  }, [formData]);

  const handlePrint = () => {
    const originalTitle = document.title;
    const name = formData.header?.fullName?.trim() || "Pengguna";
    const role =
      formData.header?.targetRole?.trim() || targetRole?.trim() || "Resume";
    const pdfFilename = `Resumix_${name}_${role}`;

    document.title = pdfFilename;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  // Loading State with Dedicated Skeleton
  if (isDetailLoading) {
    return <EditorSkeleton />;
  }

  // Error State
  if (isDetailError || !resumeDetail?.data) {
    return (
      <div className="min-h-screen bg-[#fbf8ff] flex flex-col items-center justify-center p-4">
        <div className="bg-white border border-[#ba1a1a] p-8 max-w-md w-full text-center space-y-4 rounded-none">
          <AlertCircle className="w-10 h-10 text-[#ba1a1a] mx-auto" />
          <h2 className="text-lg font-bold text-[#0f172a]">
            Resume Tidak Ditemukan
          </h2>
          <p className="text-xs text-[#5d5e61]">
            Resume yang Anda cari mungkin telah dihapus atau Anda tidak memiliki akses ke dokumen ini.
          </p>
          <Button
            variant="primary"
            onClick={() => navigate("/dashboard")}
            className="w-full flex items-center justify-center gap-1.5 rounded-none"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#f1f5f9] flex flex-col text-[#1a1b22] print:bg-white print:h-auto print:min-h-0 print:block print:p-0 print:m-0">
      {/* Top Navbar (Fixed - Hidden on Print) */}
      <div className="print:hidden flex-shrink-0">
        <Navbar />
      </div>

      {/* Editor Content Area (Locked Viewport) */}
      <div className="flex-1 flex flex-col pt-16 print:pt-0 overflow-hidden print:overflow-visible print:block">
        {/* Subheader: Document Title, Autosave status, Zoom, and Print PDF */}
        <EditorSubheader
          title={title}
          onTitleChange={handleTitleChange}
          saveStatus={saveStatus}
          zoom={zoom}
          onZoomChange={setZoom}
          onPrint={handlePrint}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          progress={progress}
        />

        {/* Main 3-Column Workspace */}
        <main className="flex-1 w-full flex flex-col lg:flex-row overflow-hidden print:overflow-visible print:block print:p-0 print:m-0">
          {/* 1. Left Sidebar: Section Navigation (Collapsible) */}
          {isSidebarOpen && (
            <EditorSidebar
              activeSection={activeSection}
              onSelectSection={(secId) => {
                if (activeSection === secId && isFormOpen) {
                  setIsFormOpen(false);
                } else {
                  setActiveSection(secId);
                  setIsFormOpen(true);
                }
              }}
              formData={formData}
              isFormOpen={isFormOpen}
            />
          )}

          {/* 2. Center Column: Focused Section Form Editor (Collapsible & Scrollable) */}
          {isFormOpen && (
            <div className="w-full lg:w-96 xl:w-[480px] bg-white border-r border-[#e2e8f0] p-4 sm:p-6 overflow-y-auto h-full flex-shrink-0 print:hidden">
              <EditorSectionForm
                activeSection={activeSection}
                onSelectSection={setActiveSection}
                data={formData}
                onChange={handleFormChange}
                onClose={() => setIsFormOpen(false)}
              />
            </div>
          )}

          {/* 3. Right Column: Live A4 Preview (Scrollable) */}
          <div className="flex-1 bg-[#525659]/10 p-4 sm:p-8 overflow-y-auto h-full flex justify-center items-start print:p-0 print:m-0 print:w-auto print:h-auto print:bg-white print:overflow-visible print:block">
            <ResumeA4Preview
              ref={previewRef}
              data={debouncedPreviewData}
              zoom={zoom}
            />
          </div>
        </main>
      </div>
    </div>
  );
};
